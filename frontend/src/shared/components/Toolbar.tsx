import { ApolloError } from "@apollo/client";
import classNames from "classnames";
import { Button, ButtonGroup, Dropdown, Col, Form, Row } from "react-bootstrap";
import Spinner from "react-spinkit";
import { DataName } from "../types";
import { Dispatch, SetStateAction } from "react";
import { CustomTooltip } from "./CustomToolTip";
import { ColDef } from "ag-grid-community";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { IExportDropdownItem } from "../helpers";

export function LoadingSpinner() {
  return (
    <div className={"centralSpinner"}>
      <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
    </div>
  );
}

export function ErrorMessage({ error }: { error: ApolloError }) {
  return (
    <Row className="ms-2">
      There was an error loading data ({error.name}: {error.message}).
    </Row>
  );
}

interface IToolbarProps {
  dataName: DataName;
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  onSearch: (userSearchVal: string) => void;
  matchingResultsCount: string;
  onDownload: () => void;
  customUILeft?: JSX.Element;
  customUIRight?: JSX.Element;
  addlExportDropdownItems?: IExportDropdownItem[];
  setColumnDefsForExport?: Dispatch<SetStateAction<ColDef[]>>;
  setSelectedExportItem?: Dispatch<SetStateAction<IExportDropdownItem | null>>;
}

export function Toolbar({
  dataName,
  userSearchVal,
  setUserSearchVal,
  onSearch,
  matchingResultsCount,
  onDownload,
  customUILeft,
  customUIRight,
  addlExportDropdownItems,
  setColumnDefsForExport,
  setSelectedExportItem,
}: IToolbarProps) {
  return (
    <Row className={classNames("d-flex align-items-center tableControlsRow")}>
      <Col>{customUILeft}</Col>

      <Col md="auto">
        <CustomTooltip
          icon={
            <InfoIcon style={{ fontSize: 18, color: "grey", marginRight: 5 }} />
          }
        >
          Click on "Search" or press "Enter" to start searching. To bulk search,
          input a list of values separated by spaces or commas (example:{" "}
          <code>value1 value2 value3</code>). To include multiple words in a
          single search term, enclose them in single or double quotes (example:{" "}
          <code>"Bone Cancer"</code>).
        </CustomTooltip>

        <Form.Control
          className={"d-inline-block"}
          style={{ width: "300px" }}
          type="search"
          placeholder={"Search " + dataName}
          aria-label="Search"
          value={userSearchVal}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch(userSearchVal);
            }
          }}
          onInput={(event) => {
            const userSearchVal = event.currentTarget.value;
            setUserSearchVal(userSearchVal);
            if (userSearchVal === "") onSearch("");
          }}
        />
      </Col>

      <Col md="auto" style={{ marginLeft: -15 }}>
        <Button
          onClick={() => onSearch(userSearchVal)}
          className={"btn btn-secondary"}
          size={"sm"}
        >
          Search
        </Button>
      </Col>

      <Col md="auto">{matchingResultsCount}</Col>

      {customUIRight}

      <Col className={"text-end"}>
        <Dropdown as={ButtonGroup}>
          <Button
            onClick={() => {
              if (setSelectedExportItem) setSelectedExportItem(null);
              onDownload();
            }}
            size={"sm"}
          >
            Export as TSV
          </Button>
          {addlExportDropdownItems?.length && setColumnDefsForExport && (
            <>
              <Dropdown.Toggle size="sm" split id="dropdown-split-basic" />
              <Dropdown.Menu>
                <Dropdown.Item
                  as="button"
                  onClick={() => {
                    if (setSelectedExportItem) setSelectedExportItem(null);
                    onDownload();
                  }}
                >
                  Export as TSV
                </Dropdown.Item>
                {addlExportDropdownItems.map((item) => (
                  <div key={item.label} className="d-flex align-items-center">
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setColumnDefsForExport(item.columnDefs);
                        if (setSelectedExportItem) setSelectedExportItem(item);
                        onDownload();
                      }}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </Dropdown.Item>
                    {item.tooltip && (
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
                        {item.tooltip}
                      </CustomTooltip>
                    )}
                  </div>
                ))}
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      </Col>
    </Row>
  );
}
