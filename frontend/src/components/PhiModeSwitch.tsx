import { Form } from "react-bootstrap";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ReactNode } from "react";
import { CustomTooltip } from "../shared/components/CustomToolTip";

export function PhiModeSwitch({ children }: { children: ReactNode }) {
  const { phiEnabled, setPhiEnabled } = usePhiEnabled();

  return (
    <div className="d-flex align-items-center gap-1">
      <Form.Check
        className="mt-1"
        type="switch"
        label="PHI-enabled"
        checked={phiEnabled}
        onChange={(e) => {
          const isPhiEnabled = e.target.checked;
          setPhiEnabled(isPhiEnabled);
          if (isPhiEnabled) {
          } else {
          }
        }}
      />
      <CustomTooltip
        icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
      >
        {children}
      </CustomTooltip>
    </div>
  );
}
