import React from "react";
import { useParams, Route, Routes } from "react-router-dom";
import { Request } from "../../generated/graphql";
import RequestSummary from "./RequestSummary";

export default function RequestView() {
  let params = useParams();
  return (
    <div className="container">
      <Routes>
        <Route path={`requests/:igoRequestId`}>
          <RequestSummary />
        </Route>
      </Routes>
    </div>
  );
}
