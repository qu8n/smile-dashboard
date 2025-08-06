import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Routes, Route } from "react-router-dom";
import RequestsPage from "./pages/requests/RequestsPage";
import PatientsPage from "./pages/patients/PatientsPage";
import SamplesPage from "./pages/samples/SamplesPage";
import CohortsPage from "./pages/cohorts/CohortsPage";
import LoginSuccessPage from "./pages/auth/LoginSuccessPage";
import SmileNavBar from "./shared/components/SmileNavBar";
import { getUserEmail } from "./utils/getUserEmail";
import { SamplesPage2 } from "./pages/samples/SamplesPage2";

// TODO: create a provider component and move the state logic there
// and wrap the <UserEmailContext.Provider> around <App> in index.tsx
// TODO: stop passing userEmail and setUserEmail as props to components
export const UserEmailContext = createContext<{
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}>({
  userEmail: null,
  setUserEmail: () => null,
});

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
      <UserEmailContext.Provider value={{ userEmail, setUserEmail }}>
        <SmileNavBar userEmail={userEmail} setUserEmail={setUserEmail} />
        <Routes>
          <>
            <Route
              path="/"
              element={
                <RequestsPage
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              }
            >
              <Route path=":igoRequestId" />
            </Route>
            <Route
              path="/requests/"
              element={
                <RequestsPage
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              }
            >
              <Route path=":igoRequestId" />
            </Route>
            {/** TODO: Remove this after testing */}
            <Route path="/test/" element={<SamplesPage2 />} />
            <Route
              path="/patients/"
              element={
                <PatientsPage
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              }
            >
              <Route path=":patientId" />
            </Route>
            <Route
              path="/samples"
              element={
                <SamplesPage
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              }
            />
            <Route
              path="/cohorts/"
              element={
                <CohortsPage
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              }
            >
              <Route path=":cohortId" />
            </Route>
            <Route path="/auth/login-success" element={<LoginSuccessPage />} />
          </>
        </Routes>
      </UserEmailContext.Provider>
    </main>
  );
}
