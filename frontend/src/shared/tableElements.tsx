import { ApolloError } from "@apollo/client";
import classNames from "classnames";
import { Button, Col, Form, Row } from "react-bootstrap";
import Spinner from "react-spinkit";
import { DataName } from "./types";
import { Dispatch, SetStateAction } from "react";
import { InfoToolTip } from "./components/InfoToolTip";

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
  handleSearch: (userSearchVal: string) => void;
  matchingResultsCount: string;
  handleDownload: () => void;
  customUILeft?: JSX.Element;
  customUIRight?: JSX.Element;
}

export function Toolbar({
  dataName,
  userSearchVal,
  setUserSearchVal,
  handleSearch,
  matchingResultsCount,
  handleDownload,
  customUILeft,
  customUIRight,
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
              handleSearch(userSearchVal);
            }
          }}
          onInput={(event) => {
            const userSearchVal = event.currentTarget.value;
            if (userSearchVal === "") {
              handleSearch(userSearchVal);
            }
            setUserSearchVal(userSearchVal);
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
          onClick={() => handleSearch(userSearchVal)}
          className={"btn btn-secondary"}
          size={"sm"}
        >
          Search
        </Button>
      </Col>

      <Col md="auto">{matchingResultsCount}</Col>

      {customUIRight}

      <Col className={"text-end"}>
        <Button onClick={handleDownload} size={"sm"}>
          Generate report
        </Button>
      </Col>
    </Row>
  );
}
