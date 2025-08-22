import { Button, ButtonGroup } from "react-bootstrap";
import { ColDef } from "ag-grid-community";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { CustomTooltip } from "../components/CustomToolTip";
import { useState } from "react";
import { DashboardRecordContext } from "../generated/graphql";

export type FilterButtonOption = {
  label: string;
  colDefs: Array<ColDef>;
  recordContexts?: Array<DashboardRecordContext>;
};

interface FilterButtonsProps {
  options: Array<FilterButtonOption>;
  onClick: (filterButtonLabel: string) => void;
  children: string;
}

export function FilterButtons({
  options,
  onClick,
  children,
}: FilterButtonsProps) {
  const [activeButtonLabel, setActiveButtonLabel] = useState(options[0].label);

  function handleButtonClick(filterButtonLabel: string) {
    setActiveButtonLabel(filterButtonLabel);
    onClick(filterButtonLabel);
  }

  return (
    <>
      <CustomTooltip
        icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
      >
        {children}
      </CustomTooltip>{" "}
      <ButtonGroup>
        {options.map((buttonOption) => (
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
