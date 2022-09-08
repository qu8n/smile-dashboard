import React, { FunctionComponent } from "react";
import Modal from "react-bootstrap/Modal";
import { CSVGenerate } from "../lib/CSVExport";

export const DownloadModal: FunctionComponent<{
  loader: () => Promise<any>;
  onComplete: () => void;
  filter: string;
}> = ({ loader, onComplete, filter }) => {
  loader().then(({ data }) => {
    console.log("exporting", data.requests.length);
    CSVGenerate(data.requests);
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
