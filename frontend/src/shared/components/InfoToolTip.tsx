import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { withStyles } from "@material-ui/core/styles";

const CustomTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "black",
    border: "1px solid lightgrey",
  },
})(Tooltip);

export function InfoToolTip({ children }: { children: React.ReactNode }) {
  return (
    <CustomTooltip title={<span style={{ fontSize: 12 }}>{children}</span>}>
      <InfoIcon style={{ fontSize: 18, color: "grey" }} />
    </CustomTooltip>
  );
}
