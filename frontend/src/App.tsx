import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LoginSuccessPage } from "./pages/auth/LoginSuccessPage";
import { SamplesPage } from "./pages/samples/SamplesPage";
import { NavBar } from "./components/NavBar";
import { Providers } from "./components/Providers";
import { WarningModal } from "./components/WarningModal";
import { RequestsPage } from "./pages/requests/RequestsPage";
import { PatientsPage } from "./pages/patients/PatientsPage";
import { CohortsPage } from "./pages/cohorts/CohortsPage";
import { ROUTE_PARAMS } from "./config";

export default function App() {
  return (
    <main id="main" className="main">
      <Providers>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<RequestsPage />}>
              <Route path={`:${ROUTE_PARAMS.requests}`} />
            </Route>
            <Route path="/requests/" element={<RequestsPage />}>
              <Route path={`:${ROUTE_PARAMS.requests}`} />
            </Route>
            <Route path="/patients/" element={<PatientsPage />}>
              <Route path={`:${ROUTE_PARAMS.patients}`} />
            </Route>
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/cohorts/" element={<CohortsPage />}>
              <Route path={`:${ROUTE_PARAMS.cohorts}`} />
            </Route>
            <Route path="/auth/login-success" element={<LoginSuccessPage />} />
          </Routes>
        </BrowserRouter>

        <WarningModal />
      </Providers>
    </main>
  );
}
