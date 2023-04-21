import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FunctionComponent } from "react";

interface IPageHeaderProps {
  pageTitle: string;
  pageRoute: string;
}

const PageHeader: FunctionComponent<IPageHeaderProps> = ({
  pageTitle,
  pageRoute,
}) => {
  pageTitle =
    pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).toLowerCase();

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
                <NavLink to={pageRoute}>{pageTitle}</NavLink>
              </li>
            </ol>
          </nav>
          <h1>{pageTitle}</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default PageHeader;
