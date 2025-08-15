import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ColDef } from "ag-grid-community";

interface UseTogglePhiColumnsParams {
  setColDefs: Dispatch<SetStateAction<Array<ColDef>>>;
  phiFields: Set<string>;
}

export function useTogglePhiColumnsVisibility({
  setColDefs,
  phiFields,
}: UseTogglePhiColumnsParams) {
  const { phiEnabled } = usePhiEnabled();
  const [phiColumnsVisible, setPhiColumnsVisible] = useState<boolean>(false);

  function showPhiColumnsOnInitialPhiSearch() {
    if (phiEnabled && !phiColumnsVisible) {
      setColDefs((prevColDefs) =>
        togglePhiColumnsVisibility({ prevColDefs, phiFields, show: true })
      );
      setPhiColumnsVisible(true);
    }
  }

  useEffect(() => {
    if (!phiEnabled && phiColumnsVisible) {
      setColDefs((prevColDefs) =>
        togglePhiColumnsVisibility({ prevColDefs, phiFields, show: false })
      );
      setPhiColumnsVisible(false);
    }
  }, [phiEnabled, phiFields, setColDefs, phiColumnsVisible]);

  return { showPhiColumnsOnInitialPhiSearch };
}

interface TogglePhiColumnsParams {
  prevColDefs: Array<ColDef>;
  phiFields: Set<string>;
  show: boolean;
}

function togglePhiColumnsVisibility({
  prevColDefs,
  phiFields,
  show,
}: TogglePhiColumnsParams) {
  return prevColDefs.map((colDef) =>
    phiFields.has(colDef.field!) ? { ...colDef, hide: !show } : colDef
  );
}
