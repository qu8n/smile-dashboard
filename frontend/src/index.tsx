import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { offsetLimitPagination } from "@apollo/client/utilities";
import App from "./App";
import { LicenseManager } from "ag-grid-enterprise";

LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_LICENSE_KEY || "");

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        requests: offsetLimitPagination(),
      },
    },
    DashboardSample: {
      keyFields: ["smileSampleId"],
    },
  },
});

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_EXPRESS_SERVER_ORIGIN}/graphql`,
  cache,
  credentials: "include",
  connectToDevTools: true,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console[dot]log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
