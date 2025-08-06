import Modal from "react-bootstrap/Modal";
import Spinner from "react-spinkit";

export function DownloadModal2({ show }: { show: boolean }) {
  return (
    <Modal show={show} size="sm">
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <p>
            Exporting the most up-to-date version of your data request. Large
            data requests may take minutes to process.
          </p>
          <Spinner fadeIn="none" color="lightblue" name="ball-grid-pulse" />
        </div>
      </Modal.Body>
    </Modal>
  );
}
