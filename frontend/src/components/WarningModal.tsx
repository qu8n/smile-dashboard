import { useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWarningModal } from "../contexts/WarningContext";

export function WarningModal() {
  const { warningModalContent, setWarningModalContent } = useWarningModal();

  const handleHide = useCallback(() => {
    setWarningModalContent(undefined);
  }, [setWarningModalContent]);

  useEffect(() => {
    if (warningModalContent === undefined) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleHide();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [warningModalContent, handleHide]);

  return (
    <Modal
      show={!!warningModalContent}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{warningModalContent}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
}
