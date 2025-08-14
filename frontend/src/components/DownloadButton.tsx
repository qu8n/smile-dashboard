import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { CustomTooltip } from "./CustomToolTip";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { DownloadOption } from "../hooks/useDownload";

interface DownloadButtonProps {
  downloadOptions: Array<DownloadOption>;
  handleDownload: (downloadOption: DownloadOption) => void;
}

export function DownloadButton({
  downloadOptions,
  handleDownload,
}: DownloadButtonProps) {
  return (
    <Dropdown as={ButtonGroup}>
      {/* Main download button */}
      <Button size={"sm"} onClick={() => handleDownload(downloadOptions[0])}>
        {downloadOptions[0].buttonLabel}
      </Button>

      {downloadOptions.length > 1 && (
        <>
          <Dropdown.Toggle size="sm" split id="dropdown-split-basic" />
          <Dropdown.Menu>
            {/* Dropdown download options */}
            {downloadOptions.map((downloadOption) => (
              <div
                key={downloadOption.buttonLabel}
                className="d-flex align-items-center"
              >
                <Dropdown.Item
                  as="button"
                  onClick={() => handleDownload(downloadOption)}
                  disabled={downloadOption.disabled}
                >
                  {downloadOption.buttonLabel}
                </Dropdown.Item>

                {/* Optional tooltip */}
                {downloadOption.tooltipContent && (
                  <DropdownItemTooltip>
                    {downloadOption.tooltipContent}
                  </DropdownItemTooltip>
                )}
              </div>
            ))}
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>
  );
}

function DropdownItemTooltip({ children }: { children: string }) {
  return (
    <CustomTooltip
      icon={
        <InfoIcon
          style={{
            fontSize: 15,
            color: "grey",
            marginRight: 10,
            marginLeft: 5,
          }}
        />
      }
    >
      {children}
    </CustomTooltip>
  );
}
