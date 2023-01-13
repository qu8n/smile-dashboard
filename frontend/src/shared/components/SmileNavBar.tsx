import * as React from "react";
import logo_with_text from "../../imgs/logo_with_text.png";

const SmileNavBar: React.FunctionComponent = (props) => {
  var requestIdSearch = "";

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a href="index.html" className="logo d-flex align-items-center">
          <img src={logo_with_text} alt="" />
        </a>
      </div>
    </header>
  );
};

export default SmileNavBar;
