import { ApolloError } from "@apollo/client";
import classNames from "classnames";
import { Button, ButtonGroup, Dropdown, Col, Form, Row } from "react-bootstrap";
import Spinner from "react-spinkit";
import { DataName } from "./types";
import { Dispatch, SetStateAction } from "react";
import { InfoToolTip } from "./components/InfoToolTip";
import { PatientIdsTriplet } from "../generated/graphql";
import { ColDef } from "ag-grid-community";

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
  setCustomSearchStates?: Dispatch<SetStateAction<PatientIdsTriplet[]>>;
  onSearch: (userSearchVal: string) => void;
  matchingResultsCount: string;
  onDownload: () => void;
  customUILeft?: JSX.Element;
  customUIRight?: JSX.Element;
  exportDropdownItems?: Array<{
    label: string;
    columnDefs: ColDef[];
  }>;
  setColumnDefsForExport?: Dispatch<SetStateAction<ColDef[]>>;
}

export function Toolbar({
  dataName,
  userSearchVal,
  setUserSearchVal,
  setCustomSearchStates,
  onSearch,
  matchingResultsCount,
  onDownload,
  customUILeft,
  customUIRight,
  exportDropdownItems,
  setColumnDefsForExport,
}: IToolbarProps) {
  return (
    <Row className={classNames("d-flex align-items-center tableControlsRow")}>
      <Col>{customUILeft}</Col>

      <Col md="auto">
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
            if (userSearchVal === "") {
              setCustomSearchStates && setCustomSearchStates([]);
              onSearch("");
            }
          }}
        />
      </Col>

      <Col md="auto" style={{ marginLeft: -15 }}>
        <InfoToolTip>
          Click on "Search" or press "Enter" to start searching. To bulk search,
          input a list of values separated by spaces or commas (example:{" "}
          <code>value1 value2 value3</code>). To include multiple words in a
          single search term, enclose them in single or double quotes (example:{" "}
          <code>"Bone Cancer"</code>).
        </InfoToolTip>
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
          <Button onClick={onDownload} size={"sm"}>
            Generate report
          </Button>
          {exportDropdownItems?.length && setColumnDefsForExport && (
            <>
              <Dropdown.Toggle size="sm" split id="dropdown-split-basic" />
              {exportDropdownItems.map((item) => (
                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      setColumnDefsForExport(item.columnDefs);
                      onDownload();
                    }}
                  >
                    {item.label}
                  </Dropdown.Item>
                </Dropdown.Menu>
              ))}
            </>
          )}
        </Dropdown>
      </Col>
    </Row>
  );
}
