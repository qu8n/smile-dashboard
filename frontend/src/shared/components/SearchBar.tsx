import { Button, Form } from "react-bootstrap";
import { CustomTooltip } from "./CustomToolTip";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { Dispatch, SetStateAction } from "react";

interface SearchBarProps {
  recordName: string;
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
  recordCount: number;
}

export function SearchBar({
  recordName,
  userSearchVal,
  setUserSearchVal,
  handleSearch,
  recordCount,
}: SearchBarProps) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
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
        className="d-inline-block"
        style={{ width: "300px" }}
        type="search"
        placeholder={`Search ${recordName}`}
        aria-label="Search"
        value={userSearchVal}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        onChange={(e) => setUserSearchVal(e.currentTarget.value)}
      />

      <Button onClick={handleSearch} className="btn btn-secondary" size={"sm"}>
        Search
      </Button>

      <span className="ms-2">
        {Number(recordCount).toLocaleString()} {recordName}
      </span>
    </div>
  );
}
