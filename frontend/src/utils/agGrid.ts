import { ColDef, IFilterDef, ITooltipParams } from "ag-grid-community";
import { allEditableFields } from "../pages/samples/config";

export function getAgGridDateColFilterConfigs({
  maxValidYear = new Date().getFullYear(),
}: { maxValidYear?: number } = {}): IFilterDef {
  return {
    filter: "agDateColumnFilter",
    filterParams: {
      buttons: ["apply", "reset"],
      filterOptions: ["inRange"],
      inRangeInclusive: true,
      minValidYear: 2016,
      maxValidYear: maxValidYear,
      suppressAndOrCondition: true,
    },
  };
}

export function getAgGridBooleanColFilterConfigs({
  showBlanksFilterOption = false,
}: { showBlanksFilterOption?: Boolean } = {}): IFilterDef {
  return {
    filter: true,
    filterParams: {
      values: !showBlanksFilterOption ? ["Yes", "No"] : ["Yes", "No", ""],
      suppressMiniFilter: true,
    },
  };
}

export function getAgGridBooleanValueFormatter({
  trueVal,
  falseVal,
}: {
  // The true/false values that appear in the database for the given field
  trueVal: String | Boolean;
  falseVal: String | Boolean;
}): ColDef {
  return {
    valueFormatter: (params) => {
      switch (params.value) {
        case trueVal:
          return "Yes";
        case falseVal:
          return "No";
        default:
          return "";
      }
    },
  };
}

export function isInvalidCostCenter(fieldName: string, value: string) {
  if (!value || fieldName !== "costCenter") return false;
  if (value.length !== 11) return true;
  const validCostCenter = new RegExp("^\\d{5}/\\d{5}$");
  return !validCostCenter.test(value);
}
