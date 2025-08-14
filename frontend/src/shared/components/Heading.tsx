import { Col, Row } from "react-bootstrap";
import { buildSentenceCaseString } from "../../utils/stringBuilders";

// TODO: change this back to Title.tsx
export function Heading({ children }: { children: string }) {
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{buildSentenceCaseString(children)}</h1>
      </Col>
    </Row>
  );
}
