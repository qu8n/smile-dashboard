import * as React from "react";
import { Container } from "react-bootstrap";

export const HomePage: React.FunctionComponent = props => {
  return (
    <Container style={{ textAlign: "center" }}>
      <div>
        Home page content.
        <br /> TODO: add info/sections on this page describing the following:
        <br />
        1. View recent deliveries.
        <br />
        2. View request details.
        <br />
        3. Edit sample metadata
      </div>
    </Container>
  );
};

export default HomePage;
