import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ColDef } from "ag-grid-community";

interface UseTogglePhiColumnsParams {
  /**
   * Function to set the active column definitions in the grid.
   */
  setColumnDefs: Dispatch<SetStateAction<ColDef[]>>;
  /**
   * Set of fields that are considered PHI to toggle visibility for.
   */
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
