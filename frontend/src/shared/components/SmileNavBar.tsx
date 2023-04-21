import * as React from "react";
import logo_with_text from "../../imgs/logo_with_text.png";
import { Nav, NavLink } from "react-bootstrap";
import { FunctionComponent } from "react";

const SmileNavBar: FunctionComponent = () => {
  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div>
          <a href="/" className="logo">
            <img src={logo_with_text} alt="" />
          </a>
        </div>
        <Nav>
          <NavLink href="/requests">Requests</NavLink>
          <NavLink href="/patients">Patients</NavLink>
        </Nav>
      </header>
    </>
  );
};

export default SmileNavBar;
