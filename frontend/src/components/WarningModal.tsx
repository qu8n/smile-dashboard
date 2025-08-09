import { useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWarningModal } from "../contexts/WarningContext";

export function WarningModal() {
  const {
    warningModalContent: warningContent,
    setWarningModalContent: setWarningContent,
  } = useWarningModal();

  const handleHide = useCallback(() => {
    setWarningContent(undefined);
  }, [setWarningContent]);

  useEffect(() => {
    if (warningContent === undefined) return;
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
  }, [warningContent, handleHide]);

  return (
    <Modal
      show={!!warningContent}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{warningContent}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
}
