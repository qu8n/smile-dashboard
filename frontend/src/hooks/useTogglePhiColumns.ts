import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ColDef } from "ag-grid-community";

interface UseTogglePhiColumnsParams {
  setColDefs: Dispatch<SetStateAction<Array<ColDef>>>;
  phiFields: Set<string>;
  userSearchVal: string;
}

export function useTogglePhiColumnsVisibility({
  setColDefs,
  phiFields,
  userSearchVal,
}: UseTogglePhiColumnsParams) {
  const { phiEnabled } = usePhiEnabled();
  const [phiColumnsVisible, setPhiColumnsVisible] = useState<boolean>(false);

  /** Show PHI columns when user has enabled PHI mode and is searching for
   * specific values. Hide PHI columns when user's search is empty even if
   * PHI mode is enabled.
   */
  function handlePhiColumnsVisibilityOnSearch() {
    if (phiEnabled) {
      const showPhiColumns = Boolean(userSearchVal);
      if (phiColumnsVisible !== showPhiColumns) {
        togglePhiColumnsVisibility({
          show: showPhiColumns,
          setColDefs,
          setPhiColumnsVisible,
          phiFields,
        });
      }
    }
  }

  useEffect(() => {
    // Automatically hide PHI columns when PHI mode is disabled
    if (!phiEnabled && phiColumnsVisible) {
      togglePhiColumnsVisibility({
        show: false,
        setColDefs,
        setPhiColumnsVisible,
        phiFields,
      });
    }
  }, [phiEnabled, phiFields, setColDefs, phiColumnsVisible]);

  return { handlePhiColumnsVisibilityOnSearch };
}

interface TogglePhiColumnsParams {
  show: boolean;
  setColDefs: Dispatch<SetStateAction<Array<ColDef>>>;
  setPhiColumnsVisible: Dispatch<SetStateAction<boolean>>;
  phiFields: Set<string>;
}

function togglePhiColumnsVisibility({
  show,
  setColDefs,
  setPhiColumnsVisible,
  phiFields,
}: TogglePhiColumnsParams) {
  setColDefs((prevColDefs) =>
    prevColDefs.map((colDef) =>
      phiFields.has(colDef.field!) ? { ...colDef, hide: !show } : colDef
    )
  );
  setPhiColumnsVisible(show);
}
