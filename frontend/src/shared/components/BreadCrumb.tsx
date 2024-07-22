import { Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { buildSentenceCaseString } from "../../utils/stringBuilders";

export function BreadCrumb({ currPageTitle }: { currPageTitle: string }) {
  return (
    <Row>
      <Col>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">
              <NavLink to={`/${currPageTitle}`}>
                {buildSentenceCaseString(currPageTitle)}
              </NavLink>
            </li>
          </ol>
        </nav>
      </Col>
    </Row>
  );
}
