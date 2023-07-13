import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const AlertModal: FunctionComponent<{
  show: boolean;
  message: string;
  onHide: () => void;
}> = ({ show, onHide, message }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Limit reached
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};
