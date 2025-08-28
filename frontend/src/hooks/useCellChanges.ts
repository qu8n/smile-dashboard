import { RefObject, ClipboardEvent, useState } from "react";
import { useUserEmail } from "../contexts/UserEmailContext";
import { useWarningModal } from "../contexts/WarningContext";
import {
  CellEditRequestEvent,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import {
  DashboardSample,
  DashboardSampleInput,
  useUpdateDashboardSamplesMutation,
} from "../generated/graphql";
import { handleAgGridPaste } from "../utils/handleAgGridPaste";
import { SampleChange } from "../types/shared";
import { formatCellDate, isInvalidCostCenter } from "../utils/agGrid";
import {
  INVALID_COST_CENTER_WARNING,
  POLLING_PAUSE_AFTER_UPDATE,
} from "../configs/shared";

interface UseCellChangesParams {
  gridRef: RefObject<AgGridReactType<any>>;
  startPolling: () => void;
  stopPolling: () => void;
  samples: Array<DashboardSample> | undefined;
  refreshData: () => void;
}

export function useCellChanges({
  gridRef,
  startPolling,
  stopPolling,
  samples,
  refreshData,
}: UseCellChangesParams) {
  const [changes, setChanges] = useState<Array<SampleChange>>([]);
  const { userEmail, setUserEmail } = useUserEmail();
  const { setWarningModalContent } = useWarningModal();
  const [updateDashboardSamplesMutation] = useUpdateDashboardSamplesMutation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  async function handleCellEditRequest(params: CellEditRequestEvent) {
    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    // Prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell = !rowNode.data[fieldName] && !newValue;
    if (noChangeInVal || noChangeInEmptyCell) {
      setChanges((changes) => {
        const updatedChanges = changes.filter(
          (c) => !(c.primaryId === primaryId && c.fieldName === fieldName)
        );
        return updatedChanges;
      });
      gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
      startPolling();
      return;
    }

    stopPolling();

    // Add/update the billedBy cell to/in the changes array
    if (fieldName === "billed" && setUserEmail) {
      let currUserEmail = userEmail;

      if (!currUserEmail) {
        currUserEmail = await new Promise<string | undefined>((resolve) => {
          window.addEventListener("message", handleLogin);

          function handleLogin(event: MessageEvent) {
            if (event.data === "success") {
              getUserEmail().then((email) => {
                window.removeEventListener("message", handleLogin);
                resolve(email);
              });
            }
          }

          openLoginPopup();
        });

        if (!currUserEmail) return;
        setUserEmail(currUserEmail);
      }

      const currUsername = currUserEmail.split("@")[0];

      setChanges((changes) => {
        const billedBy = changes.find(
          (c) => c.primaryId === primaryId && c.fieldName === "billedBy"
        );
        if (billedBy) {
          billedBy.newValue = currUsername;
        } else {
          changes.push({
            primaryId,
            fieldName: "billedBy",
            oldValue: "",
            newValue: currUsername,
            rowNode,
          });
        }
        return [...changes];
      });
    }

    // Add/update the edited cell to/in the changes array
    setChanges((changes) => {
      const change = changes.find(
        (c) => c.primaryId === primaryId && c.fieldName === fieldName
      );
      if (change) {
        change.newValue = newValue;
      } else {
        changes.push({ primaryId, fieldName, oldValue, newValue, rowNode });
      }
      return [...changes];
    });

    // Validate Cost Center inputs
    if (isInvalidCostCenter(fieldName, newValue)) {
      setWarningModalContent(INVALID_COST_CENTER_WARNING);
    }

    gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
  }

  async function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    if (!handleCellEditRequest) return;
    try {
      await handleAgGridPaste({ e, gridRef, handleCellEditRequest });
    } catch (error) {
      if (error instanceof Error) {
        setWarningModalContent(error.message);
      } else {
        console.error("Unexpected error during paste:", error);
      }
    }
  }

  function handleDiscardChanges() {
    // Remove cell styles associated with having been edited
    gridRef.current?.api?.redrawRows({
      rowNodes: changes.map((c) => c.rowNode),
    });
    setChanges([]);
    startPolling();
  }

  function handleConfirmUpdates() {
    const hasInvalidCostCenter = changes.some((c) =>
      isInvalidCostCenter(c.fieldName, c.newValue)
    );
    if (hasInvalidCostCenter) {
      setWarningModalContent(INVALID_COST_CENTER_WARNING);
    } else {
      setShowUpdateModal(true);
    }
  }

  async function handleSubmitUpdates() {
    if (changes.length === 0) {
      console.error("No changes available to submit.");
      return;
    }

    const changesByPrimaryId = groupChangesByPrimaryId(changes);
    const newDashboardSamples = buildNewDashboardSamples(changesByPrimaryId);

    // Send to GraphQL server to publish
    updateDashboardSamplesMutation({
      variables: { newDashboardSamples },
    });

    // Manually handle optimistic updates by refreshing updated rows' UI to indicate them being updated
    // (We can't use GraphQL's optimistic response because it isn't a good fit for
    // AG Grid's Server-Side data model. e.g. GraphQL's optimistic response only returns
    // the updated data, while AG Grid expects the datasource == the entire dataset.)
    const optimisticSamples = samples!.map((s) => {
      const changesForSample =
        s.primaryId != null ? changesByPrimaryId.get(s.primaryId) : undefined;
      if (changesForSample) {
        const changedFields = changesForSample.reduce((acc, change) => {
          acc[change.fieldName] = change.newValue;
          return acc;
        }, {} as Record<string, any>);
        return {
          ...s,
          ...changedFields,
          revisable: false,
          importDate: formatCellDate(new Date()) as string,
        };
      }
      return s;
    });
    optimisticSamples.sort((a, b) => {
      return (
        new Date(b.importDate ?? "").getTime() -
        new Date(a.importDate ?? "").getTime()
      );
    });
    const optimisticDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        params.success({
          rowData: optimisticSamples!,
          rowCount: optimisticSamples[0]?._total || 0,
        });
      },
    };
    gridRef.current?.api?.setServerSideDatasource(optimisticDatasource);

    // "Reset" the grid with the latest data
    setTimeout(async () => {
      refreshData();
      // No need to resume polling here as `refreshData` already does it
    }, POLLING_PAUSE_AFTER_UPDATE);
    handleDiscardChanges();
    setShowUpdateModal(false);
  }

  return {
    changes,
    setChanges,
    handleCellEditRequest,
    handlePaste,
    cellChangesHandlers: {
      handleDiscardChanges,
      handleConfirmUpdates,
      handleSubmitUpdates,
      showUpdateModal,
      setShowUpdateModal,
    },
  };
}

function groupChangesByPrimaryId(changes: SampleChange[]) {
  const changesByPrimaryId = new Map<string, Array<SampleChange>>();
  for (const change of changes) {
    if (!changesByPrimaryId.has(change.primaryId)) {
      changesByPrimaryId.set(change.primaryId, []);
    }
    changesByPrimaryId.get(change.primaryId)!.push(change);
  }
  return changesByPrimaryId;
}

function buildNewDashboardSamples(
  changesByPrimaryId: Map<string, Array<SampleChange>>
) {
  const newDashboardSamplesByPrimaryId = new Map<
    string,
    DashboardSampleInput
  >();
  changesByPrimaryId.forEach((changes, primaryId) => {
    const sampleData = { ...changes[0].rowNode.data };
    for (const change of changes) {
      (sampleData as any)[change.fieldName] = change.newValue;
    }
    delete sampleData.__typename;
    newDashboardSamplesByPrimaryId.set(primaryId, {
      ...sampleData,
      revisable: false,
      changedFieldNames: changes.map((c) => c.fieldName),
    });
  });
  return Array.from(newDashboardSamplesByPrimaryId.values());
}
