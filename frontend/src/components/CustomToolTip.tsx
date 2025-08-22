import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "black",
    border: "1px solid lightgrey",
  },
})(Tooltip);

export function CustomTooltip({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <StyledTooltip title={<span style={{ fontSize: 12 }}>{children}</span>}>
      <div style={{ display: "inline-block" }}>{icon}</div>
    </StyledTooltip>
  );
}
