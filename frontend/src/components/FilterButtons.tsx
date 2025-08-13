import { Button, ButtonGroup } from "react-bootstrap";
import { ColDef } from "ag-grid-community";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { CustomTooltip } from "../shared/components/CustomToolTip";
import { ReactNode, useState } from "react";
import { DashboardRecordContext } from "../generated/graphql";

export type FilterButtonOption = {
  label: string;
  columnDefs: ColDef[];
  contexts?: DashboardRecordContext[];
};

interface FilterButtonsProps {
  /**
   * A map of filter button options, where the key is the button label and the
   * value contains column definitions and optional contexts.
   */
  buttonOptions: Array<FilterButtonOption>;
  /**
   * Callback function to run additional logic when a filter button is clicked,
   * like updating the column definitions.
   */
  onButtonClick: (filterButtonLabel: string) => void;
  /**
   * Content to be displayed inside the tooltip.
   */
  children: ReactNode;
}

export function FilterButtons({
  buttonOptions,
  onButtonClick,
  children,
}: FilterButtonsProps) {
  const [activeButtonLabel, setActiveButtonLabel] = useState<string>(
    buttonOptions[0].label
  );

  function handleButtonClick(filterButtonLabel: string) {
    setActiveButtonLabel(filterButtonLabel);
    onButtonClick(filterButtonLabel);
  }

  return (
    <>
      <CustomTooltip
        icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
      >
        {children}
      </CustomTooltip>{" "}
      <ButtonGroup>
        {buttonOptions.map((buttonOption) => (
          <Button
            key={buttonOption.label}
            onClick={() => handleButtonClick(buttonOption.label)}
            size="sm"
            variant="outline-secondary"
            active={buttonOption.label === activeButtonLabel}
          >
            {buttonOption.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
