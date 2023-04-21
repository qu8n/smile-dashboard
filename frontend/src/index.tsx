import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequestsPage from "./pages/requests/RequestsPage";
import SmileNavBar from "./shared/components/SmileNavBar";
import { offsetLimitPagination } from "@apollo/client/utilities";
import PatientsPage from "./pages/patients/PatientsPage";

const cache = new InMemoryCache({
  /* @ts-ignore */
  typePolicies: {
    Query: {
      fields: {
        requests: offsetLimitPagination(),
      },
    },
    Sample: {
      keyFields: ["smileSampleId"],
    },
    SampleMetadata: {
      keyFields: ["primaryId"],
    },
  },
});

const client = new ApolloClient({
  uri:
    process.env.REACT_APP_GRAPHQL_CLIENT_URI === undefined
      ? "http://localhost:4000/graphql"
      : process.env.REACT_APP_GRAPHQL_CLIENT_URI,
  cache,
});

const root = ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <div>
        <SmileNavBar />

        <main id="main" className="main">
          <section className="section dashboard">
            <Routes>
              <Route path="/" element={<RequestsPage />}>
                <Route path=":igoRequestId" />
              </Route>
              <Route path="/requests/" element={<RequestsPage />}>
                <Route path=":igoRequestId" />
              </Route>
              <Route path="/patients/" element={<PatientsPage />}>
                <Route path=":cmoPatientId" />
              </Route>
            </Routes>
          </section>
        </main>
      </div>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
