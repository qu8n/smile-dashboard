import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import jsdownload from "js-file-download";
import Spinner from "react-spinkit";

interface DownloadModalProps {
  loader: () => Promise<string>;
  onComplete: () => void;
  exportFileName: string;
}

export function DownloadModal({
  loader,
  onComplete,
  exportFileName,
}: DownloadModalProps) {
  // Wrapping the download call in a useEffect hook, set to run only on mount,
  // to ensure it only runs once. Without this, the async loader function will
  // trigger another unnecessary re-render when it resolves
  useEffect(() => {
    loader().then((str) => {
      jsdownload(str, exportFileName);
      onComplete();
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Modal show={true} size={"sm"}>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <p>
            Downloading the latest version of your data request and converting
            it to TSV format. This may take up to 30s.
          </p>
          <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
        </div>
      </Modal.Body>
    </Modal>
  );
}
