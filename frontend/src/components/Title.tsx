import { Col, Row } from "react-bootstrap";
import { buildSentenceCaseString } from "../utils/stringBuilders";

export function Title({ children }: { children: string }) {
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{buildSentenceCaseString(children)}</h1>
      </Col>
    </Row>
  );
}
