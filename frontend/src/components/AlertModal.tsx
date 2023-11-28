import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const AlertModal: FunctionComponent<{
  show: boolean;
  title: string;
  content: string;
  onHide: () => void;
}> = ({ show, title, content, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};
