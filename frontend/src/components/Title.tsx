import { Col, Row } from "react-bootstrap";

export function Title({ children }: { children: string }) {
  const sentenceCaseTitle =
    children.charAt(0).toUpperCase() + children.slice(1);
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{sentenceCaseTitle}</h1>
      </Col>
    </Row>
  );
}
