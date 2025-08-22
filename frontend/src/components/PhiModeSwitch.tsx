import { Form } from "react-bootstrap";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { ChangeEvent } from "react";
import { CustomTooltip } from "../components/CustomToolTip";

export function PhiModeSwitch({ children }: { children: string }) {
  const { phiEnabled, setPhiEnabled } = usePhiEnabled();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const isPhiEnabled = e.target.checked;
    setPhiEnabled(isPhiEnabled);
  }

  return (
    <div className="d-flex align-items-center gap-1">
      <Form.Check
        className="mt-1"
        type="switch"
        label="PHI-enabled"
        checked={phiEnabled}
        onChange={handleChange}
      />
      <CustomTooltip
        icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
      >
        {children}
      </CustomTooltip>
    </div>
  );
}
