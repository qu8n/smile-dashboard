import { Col, Row } from "react-bootstrap";
import { buildSentenceCaseString } from "../../utils/stringBuilders";

export function Title({ text }: { text: string }) {
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{buildSentenceCaseString(text)}</h1>
      </Col>
    </Row>
  );
}
