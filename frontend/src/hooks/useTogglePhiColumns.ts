import { Dispatch, SetStateAction, useState } from "react";
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

export function useTogglePhiColumns({
  setColumnDefs,
  phiFields,
}: UseTogglePhiColumnsParams) {
  const { phiEnabled } = usePhiEnabled();
  const [phiColumnsVisible, setPhiColumnsVisible] = useState<boolean>(false);

  function handleTogglingPhiColumns() {
    if (phiEnabled !== phiColumnsVisible) {
      setColumnDefs((prevColumnDefs) =>
        prevColumnDefs.map((colDef) =>
          phiFields.has(colDef.field!)
            ? { ...colDef, hide: !phiEnabled }
            : colDef
        )
      );
      setPhiColumnsVisible(phiEnabled);
    }
  }

  return { handleTogglingPhiColumns };
}
