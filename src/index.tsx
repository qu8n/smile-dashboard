import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecentDeliveriesPage from "./pages/recentDeliveries/RecentDeliveriesPage";
import { Container } from "react-bootstrap";
import HomePage from "./pages/home/HomePage";
import SmileNavBar from "./shared/components/SmileNavBar";
import { offsetLimitPagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        requests: offsetLimitPagination()
      }
    }
  }
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache
});

const root = ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Container>
        <SmileNavBar />
        <Routes>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/recentDeliveries" element={<RecentDeliveriesPage />} />
        </Routes>
      </Container>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
