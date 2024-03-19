import { ApolloError } from "@apollo/client";
import classNames from "classnames";
import { Button, Col, Form, Row } from "react-bootstrap";
import Spinner from "react-spinkit";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { Tooltip } from "@material-ui/core";
import { DataName } from "./types";
import { Dispatch, SetStateAction } from "react";

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

export function Toolbar({
  dataName,
  userSearchVal,
  setUserSearchVal,
  handleSearch,
  clearUserSearchVal,
  matchingResultsCount,
  handleDownload,
  customUI,
}: {
  dataName: DataName;
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
  clearUserSearchVal: () => void;
  matchingResultsCount: string;
  handleDownload: () => void;
  customUI?: JSX.Element;
}) {
  return (
    <Row
      className={classNames(
        "d-flex justify-content-between align-items-center tableControlsRow"
      )}
    >
      <Col></Col>

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
              handleSearch();
            }
          }}
          onInput={(event) => {
            const userSearchVal = event.currentTarget.value;
            if (userSearchVal === "") {
              clearUserSearchVal();
            }
            setUserSearchVal(userSearchVal);
          }}
        />
      </Col>

      <Col md="auto" style={{ marginLeft: -15 }}>
        <Tooltip
          title={
            <span style={{ fontSize: 12 }}>
              After inputting your search query, click on &quot;Search&quot; or
              press &quot;Enter&quot; to get your results. To bulk search, input
              a list of values separated by spaces or commas (e.g. &quot;value1
              value2 value3&quot;)
            </span>
          }
        >
          <InfoIcon style={{ fontSize: 18, color: "grey" }} />
        </Tooltip>
      </Col>

      <Col md="auto" style={{ marginLeft: -15 }}>
        <Button
          onClick={handleSearch}
          className={"btn btn-secondary"}
          size={"sm"}
        >
          Search
        </Button>
      </Col>

      <Col md="auto">{matchingResultsCount}</Col>

      {customUI}

      <Col className={"text-end"}>
        <Button onClick={handleDownload} size={"sm"}>
          Generate Report
        </Button>
      </Col>
    </Row>
  );
}
