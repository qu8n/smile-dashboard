import { ReactNode } from "react";
import { Row } from "react-bootstrap";

// TODO: change this back to Toolbar.tsx
export function Toolbarr({ children }: { children: ReactNode }) {
  return (
    <Row className="d-flex align-items-center justify-content-center my-2">
      {children}
    </Row>
  );
}
