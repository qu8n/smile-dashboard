import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";

export function InfoToolTip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip title={<span style={{ fontSize: 12 }}>{children}</span>}>
      <InfoIcon style={{ fontSize: 18, color: "grey" }} />
    </Tooltip>
  );
}
