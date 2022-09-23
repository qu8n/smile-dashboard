import React, { FunctionComponent, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { CSVFormulate } from "../lib/CSVExport";
import jsdownload from "js-file-download";

export const DownloadModal: FunctionComponent<{
  loader: () => Promise<any>;
  onComplete: () => void;
  filter: string;
}> = ({ loader, onComplete, filter }) => {
  const doDownload = useCallback(() => {
    loader().then(({ data }) => {
      const csvString = CSVFormulate(data.requests);
      jsdownload(csvString, "requests.tsv");
      //onComplete();
    });
  }, []);

  return (
    <Modal show={true}>
      <Modal.Body>
        <div>Downloading data</div>
      </Modal.Body>
    </Modal>
  );
};
