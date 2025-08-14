import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ColDef } from "ag-grid-community";

interface UseTogglePhiColumnsParams {
  setColumnDefs: Dispatch<SetStateAction<Array<ColDef>>>;
  phiFields: Set<string>;
}

export function useTogglePhiColumnsVisibility({
  setColumnDefs,
  phiFields,
}: UseTogglePhiColumnsParams) {
  const { phiEnabled } = usePhiEnabled();
  const [phiColumnsVisible, setPhiColumnsVisible] = useState<boolean>(false);

  function showPhiColumnsOnInitialPhiSearch() {
    if (phiEnabled && !phiColumnsVisible) {
      setColumnDefs((prevColumnDefs) =>
        togglePhiColumnsVisibility({ prevColumnDefs, phiFields, show: true })
      );
      setPhiColumnsVisible(true);
    }
  }

  useEffect(() => {
    if (!phiEnabled && phiColumnsVisible) {
      setColumnDefs((prevColumnDefs) =>
        togglePhiColumnsVisibility({ prevColumnDefs, phiFields, show: false })
      );
      setPhiColumnsVisible(false);
    }
  }, [phiEnabled, phiFields, setColumnDefs, phiColumnsVisible]);

  return { showPhiColumnsOnInitialPhiSearch };
}

interface TogglePhiColumnsParams {
  prevColumnDefs: Array<ColDef>;
  phiFields: Set<string>;
  show: boolean;
}

function togglePhiColumnsVisibility({
  prevColumnDefs,
  phiFields,
  show,
}: TogglePhiColumnsParams) {
  return prevColumnDefs.map((colDef) =>
    phiFields.has(colDef.field!) ? { ...colDef, hide: !show } : colDef
  );
}
