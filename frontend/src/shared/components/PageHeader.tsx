import { Col, Row } from "react-bootstrap";
import { buildSentenceCaseString } from "../../utils/stringBuilders";

export function PageHeader({ title }: { title: string }) {
  return (
    <Row className="pagetitle">
      <Col>
        <h1>{buildSentenceCaseString(title)}</h1>
      </Col>
    </Row>
  );
}
