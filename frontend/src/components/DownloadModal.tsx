import { FunctionComponent } from "react";
import Modal from "react-bootstrap/Modal";
import jsdownload from "js-file-download";
import Spinner from "react-spinkit";

export const DownloadModal: FunctionComponent<{
  loader: () => Promise<string>;
  onComplete: () => void;
  exportFileName: string;
}> = ({ loader, onComplete, exportFileName }) => {
  loader().then((str) => {
    jsdownload(str, exportFileName);
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
