import React, { FunctionComponent, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { CSVFormulate } from "../lib/CSVExport";
import jsdownload from "js-file-download";
import Spinner from "react-spinkit";

export const DownloadModal: FunctionComponent<{
  loader: () => Promise<any>;
  onComplete: () => void;
  filter: string;
}> = ({ loader, onComplete, filter }) => {
  // const doDownload = useCallback(() => {
  //
  // }, []);

  loader().then(({ data }) => {
    const csvString = CSVFormulate(data.requests);
    jsdownload(csvString, "requests.tsv");
    onComplete();
  });

  return (
    <Modal show={true} size={"sm"}>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <p>Downloading data ...</p>
          <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
        </div>
      </Modal.Body>
    </Modal>
  );
};
