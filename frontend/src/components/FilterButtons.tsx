import { Button, ButtonGroup } from "react-bootstrap";
import { ColDef } from "ag-grid-community";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { CustomTooltip } from "../shared/components/CustomToolTip";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { DashboardRecordContext } from "../generated/graphql";

export type FilterOptionProps = {
  columnDefs: ColDef[];
  contexts?: DashboardRecordContext[];
};

interface FilterButtonsProps {
  /**
   * The currently selected filter button state
   */
  filterButton: string;
  /**
   * Function to update the filter button state
   */
  setFilterButton: Dispatch<SetStateAction<string>>;
  /**
   * A map of filter button options, where the key is the button label and the
   * value contains column definitions and optional contexts
   */
  filterButtonOptions: Map<string, FilterOptionProps>;
  /**
   * Content to be displayed inside the tooltip
   */
  children: ReactNode;
}

export function FilterButtons({
  filterButton,
  setFilterButton,
  filterButtonOptions,
  children,
}: FilterButtonsProps) {
  return (
    <>
      <CustomTooltip
        icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
      >
        {children}
      </CustomTooltip>{" "}
      <ButtonGroup>
        {Array.from(filterButtonOptions.keys()).map((filterButtonKey) => (
          <Button
            key={filterButtonKey}
            onClick={() => setFilterButton(filterButtonKey)}
            size="sm"
            variant="outline-secondary"
            active={filterButton === filterButtonKey}
          >
            {filterButtonKey}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
