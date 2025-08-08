import { Routes, Route } from "react-router-dom";
import RequestsPage from "./pages/requests/RequestsPage";
import PatientsPage from "./pages/patients/PatientsPage";
import SamplesPage from "./pages/samples/SamplesPage";
import CohortsPage from "./pages/cohorts/CohortsPage";
import { LoginSuccessPage } from "./pages/auth/LoginSuccessPage";
import { SamplesPage2 } from "./pages/samples/SamplesPage2";
import { UserEmailProvider } from "./contexts/UserEmailContext";
import { PhiEnabledProvider } from "./contexts/PhiEnabledContext";
import { NavBar } from "./shared/components/NavBar";

export default function App() {
  return (
    <main id="main" className="main">
      <UserEmailProvider>
        <PhiEnabledProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<RequestsPage />}>
              <Route path=":igoRequestId" />
            </Route>
            <Route path="/requests/" element={<RequestsPage />}>
              <Route path=":igoRequestId" />
            </Route>
            {/** TODO: Remove this after testing */}
            <Route path="/test/" element={<SamplesPage2 />} />
            <Route path="/patients/" element={<PatientsPage />}>
              <Route path=":patientId" />
            </Route>
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/cohorts/" element={<CohortsPage />}>
              <Route path=":cohortId" />
            </Route>
            <Route path="/auth/login-success" element={<LoginSuccessPage />} />
          </Routes>
        </PhiEnabledProvider>
      </UserEmailProvider>
    </main>
  );
}
