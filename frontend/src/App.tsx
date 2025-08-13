import { Routes, Route } from "react-router-dom";
import PatientsPage from "./pages/patients/PatientsPage";
import CohortsPage from "./pages/cohorts/CohortsPage";
import { LoginSuccessPage } from "./pages/auth/LoginSuccessPage";
import { SamplesPage } from "./pages/samples/SamplesPage";
import { NavBar } from "./shared/components/NavBar";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "./components/Providers";
import { WarningModal } from "./components/WarningModal";
import { RequestsPage } from "./pages/requests/RequestsPage";

export default function App() {
  return (
    <main id="main" className="main">
      <Providers>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<RequestsPage />}>
              <Route path=":igoRequestId" />
            </Route>
            <Route path="/requests/" element={<RequestsPage />}>
              <Route path=":igoRequestId" />
            </Route>
            <Route path="/patients/" element={<PatientsPage />}>
              <Route path=":patientId" />
            </Route>
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/cohorts/" element={<CohortsPage />}>
              <Route path=":cohortId" />
            </Route>
            <Route path="/auth/login-success" element={<LoginSuccessPage />} />
          </Routes>
        </BrowserRouter>

        <WarningModal />
      </Providers>
    </main>
  );
}
