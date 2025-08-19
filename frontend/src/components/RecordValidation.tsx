import { Dispatch, SetStateAction, useState } from "react";
import { DashboardRequest } from "../generated/graphql";
import { CustomTooltip } from "../components/CustomToolTip";
import WarningIcon from "@material-ui/icons/Warning";
import { Button, Modal } from "react-bootstrap";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  MISSING_STATUS,
  REQUEST_STATUS_MAP,
  SAMPLE_STATUS_MAP,
  StatusItem,
  StatusMap,
} from "../configs/recordValidationMaps";
import { multiLineColDef } from "../config";

type ModalTitle = `Error report for ${string}`;

export function RecordValidation({
  validationStatus,
  validationReport,
  toleratedSampleErrors,
  modalTitle,
  recordStatusMap,
}: {
  validationStatus: DashboardRequest["validationStatus"];
  validationReport: DashboardRequest["validationReport"];
  toleratedSampleErrors?: DashboardRequest["toleratedSampleErrors"];
  modalTitle: ModalTitle;
  recordStatusMap: StatusMap;
}) {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <WarningIconButton setModalShow={setModalShow} />
      {modalShow && (
        <ErrorReportModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          validationStatus={validationStatus}
          validationReport={validationReport}
          toleratedSampleErrors={toleratedSampleErrors}
          title={modalTitle}
          recordStatusMap={recordStatusMap}
        />
      )}
    </>
  );
}

const validationColDefs: ColDef<StatusItem>[] = [
  {
    field: "requestLevelValidationHeader",
    hide: true,
    rowGroup: true,
  },
  {
    field: "item",
    headerName: "Item",
    maxWidth: 250,
  },
  {
    field: "description",
    headerName: "Description",
  },
  {
    field: "actionItem",
    headerName: "Action Item",
  },
  {
    field: "responsibleParty",
    headerName: "Responsible Party",
    maxWidth: 170,
  },
  // For request validation only - Group sample validation errors under one header
  {
    field: "sampleLevelValidationHeader",
    hide: true,
    rowGroup: true,
  },
  // For request validation only - Group same-sample validation errors by igoId
  {
    field: "igoId",
    hide: true,
    rowGroup: true,
  },
  // For tolerated sample validation errors in request validation popup
  {
    field: "toleratedSampleLevelValidationHeader",
    hide: true,
    rowGroup: true,
  },
  // For tolerated sample validation errors in request validation popup
  {
    field: "primaryId",
    hide: true,
    rowGroup: true,
  },
];

function ErrorReportModal({
  show,
  onHide,
  validationStatus,
  validationReport,
  toleratedSampleErrors,
  title,
  recordStatusMap,
}: {
  show: boolean;
  onHide: () => void;
  validationStatus: DashboardRequest["validationStatus"];
  validationReport: DashboardRequest["validationReport"];
  toleratedSampleErrors: DashboardRequest["toleratedSampleErrors"];
  title: ModalTitle;
  recordStatusMap: StatusMap;
}) {
  const validationDataForAgGrid: StatusItem[] = [];

  // Prepare the data for AG Grid
  if (validationReport) {
    // Parse the validation report string and handle the `samples` field separately if applicable
    const validationReportMap = parseValidationReport(validationReport);
    // toleratedSampleErrors is undefined if it's a validation report of anything other than request-level
    if (typeof toleratedSampleErrors === "undefined") {
      validationDataForAgGrid.push(
        ...Array.from(validationReportMap, ([fieldName, report]) => {
          const statusItem = recordStatusMap[`${fieldName} ${report}`];
          return statusItem || null;
        }).filter((item) => item !== null)
      );
    } else {
      const requestErrors: Array<[string, keyof typeof REQUEST_STATUS_MAP]> =
        [];
      validationReportMap.forEach((value, key) => {
        requestErrors.push([
          "request",
          `${key} ${value}` as keyof typeof REQUEST_STATUS_MAP,
        ]);
      });

      if (requestErrors.length > 0) {
        requestErrors.forEach(([_, statusMapKey]) => {
          const statusItem = REQUEST_STATUS_MAP[statusMapKey];
          if (statusItem) {
            validationDataForAgGrid.push({
              requestLevelValidationHeader: "Request-level validation errors",
              ...statusItem,
            });
          }
        });
      }
    }

    // For request-level validation, validation reports of failed samples are nested inside the request's
    // Status > validationReport > samples > an individual sample's status > validationReport
    const samplesValidationReports =
      parseNestedSamplesValidationReport(validationReport);
    if (samplesValidationReports.length > 0) {
      samplesValidationReports.forEach(([igoId, statusMapKey]) => {
        const statusItem = SAMPLE_STATUS_MAP[statusMapKey];
        if (statusItem) {
          validationDataForAgGrid.push({
            sampleLevelValidationHeader: "Sample-level validation errors",
            igoId,
            ...statusItem,
          });
        }
      });
    }

    // for samples with tolerated import errors or warnings to display in the request validation report popup
    if (toleratedSampleErrors && toleratedSampleErrors?.length > 0) {
      toleratedSampleErrors.forEach((sample) => {
        if (sample?.validationStatus === false) {
          const primaryId = sample?.primaryId!;
          const reportMap = parseValidationReport(sample?.validationReport!);
          reportMap.forEach((value, key) => {
            const statusItem =
              SAMPLE_STATUS_MAP[
                `${key} ${value}` as keyof typeof SAMPLE_STATUS_MAP
              ];
            if (statusItem) {
              validationDataForAgGrid.push({
                toleratedSampleLevelValidationHeader:
                  "Sample-level validation warnings",
                primaryId,
                ...statusItem,
              });
            }
          });
        }
      });
    }

    // When a record's validationStatus is missing, display a note to the user
  } else if (validationStatus === null) {
    validationDataForAgGrid.push(...MISSING_STATUS);
  }

  if (validationDataForAgGrid.length === 0) {
    return null;
  }

  return (
    <Modal dialogClassName="modal-90w" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="popupTableHeight ag-theme-alpine">
          <AgGridReact<StatusItem>
            groupDisplayType="groupRows"
            rowData={validationDataForAgGrid}
            columnDefs={validationColDefs}
            defaultColDef={multiLineColDef}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function parseValidationReport(validationReport: string): Map<string, string> {
  const validationReportMap = new Map<string, string>();
  try {
    // Parse the validation report JSON string
    // e.g. "{"fastQs":"missing","igoComplete":"false"}"
    return new Map(Object.entries(JSON.parse(validationReport)));
  } catch (e) {
    // Parse the alternative format of the validation report data
    // e.g. "{fastQs=missing,igoComplete=false}"
    const keyValuePairs = validationReport.replace(/[{}]/g, "").split(",");
    for (const keyValuePair of keyValuePairs) {
      const [key, value] = keyValuePair.split("=").map((str) => str.trim());
      if (key && value) {
        validationReportMap.set(key, value);
      }
    }
    return validationReportMap;
  }
}

function parseNestedSamplesValidationReport(input: string) {
  const result: Array<[string, keyof typeof SAMPLE_STATUS_MAP]> = [];
  try {
    // Parse the validation report string as JSON
    // e.g. "{"samples":[{"igoId":"06000_PD_1","cmoInfoIgoId":"06000_PD_1",...}]}"
    const obj = JSON.parse(input);
    if (obj && Array.isArray(obj.samples)) {
      for (const sample of obj.samples) {
        const igoId = sample.igoId;
        const validationReport = sample?.status?.validationReport;
        if (igoId && validationReport !== undefined) {
          const reportMap =
            validationReport instanceof Map
              ? validationReport
              : parseValidationReport(validationReport);
          reportMap.forEach((value, key) => {
            result.push([
              igoId,
              `${key} ${value}` as keyof typeof SAMPLE_STATUS_MAP,
            ]);
          });
        }
      }
    }
  } catch {
    // Parse the alternative format of the validation report data
    // e.g. "{samples=[{igoId=06000_PD_1, cmoInfoIgoId=06000_PD_1, ...}]}"
    const pattern = /igoId=([^,}\s]+)[\s\S]*?validationReport=\{([^}]*)\}/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(input)) !== null) {
      const igoId = match[1];
      const reportContent = match[2];
      const reportMap = parseValidationReport(`{${reportContent}}`);
      reportMap.forEach((value, key) => {
        result.push([
          igoId,
          `${key} ${value}` as keyof typeof SAMPLE_STATUS_MAP,
        ]);
      });
    }
  }
  return result;
}

function WarningIconButton({
  setModalShow,
}: {
  setModalShow: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      role="button"
      style={{ display: "contents" }}
      onClick={() => setModalShow(true)}
      aria-label="Warning"
    >
      <CustomTooltip icon={<WarningIcon className="warning-icon" />}>
        Click to view validation errors
      </CustomTooltip>
    </div>
  );
}
