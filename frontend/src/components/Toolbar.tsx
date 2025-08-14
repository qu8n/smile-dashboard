import { ReactNode } from "react";
import { Row } from "react-bootstrap";

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <Row className="d-flex align-items-center justify-content-center my-2">
      {children}
    </Row>
  );
}
