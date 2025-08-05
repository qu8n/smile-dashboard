import { Col, Row } from "react-bootstrap";
import { buildSentenceCaseString } from "../../utils/stringBuilders";

// TODO: change this back to Title.tsx
export function Heading({ children }: { children: string }) {
  const heading = buildSentenceCaseString(children);
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{heading}</h1>
      </Col>
    </Row>
  );
}
