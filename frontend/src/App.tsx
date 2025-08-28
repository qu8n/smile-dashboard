import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LoginSuccessPage } from "./pages/auth/LoginSuccessPage";
import { SamplesPage } from "./pages/samples/SamplesPage";
import { NavBar } from "./components/NavBar";
import { Providers } from "./components/Providers";
import { WarningModal } from "./components/WarningModal";
import { RequestsPage } from "./pages/requests/RequestsPage";
import { PatientsPage } from "./pages/patients/PatientsPage";
import { CohortsPage } from "./pages/cohorts/CohortsPage";
import { ROUTE_PARAMS } from "./configs/shared";

// Required imports for AG Grid tables to render correctly
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

export default function App() {
  return (
    <main id="main" className="main">
      <Providers>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<RequestsPage />} />
            <Route path="/requests/" element={<RequestsPage />} />
            <Route
              path={`/requests/:${ROUTE_PARAMS.requests}`}
              element={<RequestsPage />}
            />
            <Route path="/patients/" element={<PatientsPage />} />
            <Route
              path={`/patients/:${ROUTE_PARAMS.patients}`}
              element={<PatientsPage />}
            />
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/cohorts/" element={<CohortsPage />} />
            <Route
              path={`/cohorts/:${ROUTE_PARAMS.cohorts}`}
              element={<CohortsPage />}
            />
            <Route path="/auth/login-success" element={<LoginSuccessPage />} />
          </Routes>
        </BrowserRouter>

        <WarningModal />
      </Providers>
    </main>
  );
}
