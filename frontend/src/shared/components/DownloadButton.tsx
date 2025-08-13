import { ColDef } from "ag-grid-community";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { CustomTooltip } from "./CustomToolTip";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { ReactNode } from "react";

export interface DownloadOption {
  /**
   * Label for the download option button.
   */
  label: string;
  /**
   * Column definitions for the data to be downloaded.
   * Typically, this will be the same column definitions used in the current table.
   */
  columnDefs: Array<ColDef>;
  /**
   * Async function that fetches the data to be downloaded.
   * Usage: pass in `getRenderedData` from the `useDownload` hook to fetch the
   * current search results on the page, or create your own function to fetch
   * data for other purposes.
   */
  dataGetter: () => Promise<Array<any>>;
  /**
   * Optional content of a tooltip to display next to the download label
   * in the dropdown menu.
   */
  tooltipContent?: string;
  /**
   * Optionally disable a download option in the dropdown menu.
   */
  disabled?: boolean;
}

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
        {downloadOptions[0].label}
      </Button>

      {downloadOptions.length > 1 && (
        <>
          <Dropdown.Toggle size="sm" split id="dropdown-split-basic" />
          <Dropdown.Menu>
            {/* Dropdown download options */}
            {downloadOptions.map((downloadOption) => (
              <div
                key={downloadOption.label}
                className="d-flex align-items-center"
              >
                <Dropdown.Item
                  as="button"
                  onClick={() => handleDownload(downloadOption)}
                  disabled={downloadOption.disabled}
                >
                  {downloadOption.label}
                </Dropdown.Item>

                {/* Optional tooltip */}
                <DropdownItemTooltip>
                  {downloadOption.tooltipContent}
                </DropdownItemTooltip>
              </div>
            ))}
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>
  );
}

function DropdownItemTooltip({ children }: { children: ReactNode }) {
  if (!children) return null;
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
