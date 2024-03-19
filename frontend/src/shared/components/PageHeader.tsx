import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function PageHeader({ dataName }: { dataName: string }) {
  const pageTitle =
    dataName.charAt(0).toUpperCase() + dataName.slice(1).toLowerCase();

  return (
    <Container fluid>
      <Row className="pagetitle">
        <Col>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">
                <NavLink to={`/${dataName}`}>{pageTitle}</NavLink>
              </li>
            </ol>
          </nav>
          <h1>{pageTitle}</h1>
        </Col>
      </Row>
    </Container>
  );
}
