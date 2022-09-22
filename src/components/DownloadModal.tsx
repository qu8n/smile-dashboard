import React, { FunctionComponent } from "react";
import Modal from "react-bootstrap/Modal";
import { CSVFormulate } from "../lib/CSVExport";
import jsdownload from "js-file-download";

export const DownloadModal: FunctionComponent<{
  loader: () => Promise<any>;
  onComplete: () => void;
  filter: string;
}> = ({ loader, onComplete, filter }) => {
  loader().then(({ data }) => {
    console.log("exporting", data.requests.length);
    const csvString = CSVFormulate(data.requests);
    jsdownload(csvString, "report.csv");
    onComplete();
  });

  return (
    <Modal show={true}>
      <Modal.Body>
        <div>Downloading data</div>
      </Modal.Body>
    </Modal>
  );
};
