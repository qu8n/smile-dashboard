import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import RequestsPage from "./pages/requests/RequestsPage";
import PatientsPage from "./pages/patients/PatientsPage";
import SamplesPage from "./pages/samples/SamplesPage";
import CohortsPage from "./pages/cohorts/CohortsPage";
import LoginSuccessPage from "./pages/auth/LoginSuccessPage";
import SmileNavBar from "./shared/components/SmileNavBar";
import { getUserEmail } from "./utils/getUserEmail";

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getAndSetUserEmail() {
      const userEmail = await getUserEmail();
      setUserEmail(userEmail);
    }
    getAndSetUserEmail();
  }, []);

  return (
    <main id="main" className="main">
      <SmileNavBar userEmail={userEmail} setUserEmail={setUserEmail} />
      <Routes>
        <>
          <Route path="/" element={<RequestsPage />}>
            <Route path=":igoRequestId" />
          </Route>

          <Route path="/requests/" element={<RequestsPage />}>
            <Route path=":igoRequestId" />
          </Route>

          <Route
            path="/patients/"
            element={
              <PatientsPage userEmail={userEmail} setUserEmail={setUserEmail} />
            }
          >
            <Route path=":smilePatientId" />
          </Route>

          <Route
            path="/samples"
            element={
              <SamplesPage userEmail={userEmail} setUserEmail={setUserEmail} />
            }
          />

          <Route
            path="/cohorts/"
            element={
              <CohortsPage userEmail={userEmail} setUserEmail={setUserEmail} />
            }
          >
            <Route path=":cohortId" />
          </Route>

          <Route path="/auth/login-success" element={<LoginSuccessPage />} />
        </>
      </Routes>
    </main>
  );
}
