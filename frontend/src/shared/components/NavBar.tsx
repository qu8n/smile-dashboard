import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserEmail } from "../../contexts/UserEmailContext";

export function NavBar() {
  const { userEmail, setUserEmail } = useUserEmail();

  function handleLogout() {
    fetch(`${process.env.REACT_APP_EXPRESS_SERVER_ORIGIN}/auth/logout`, {
      method: "POST",
      credentials: "include",
      mode: "no-cors",
    });
    setUserEmail(undefined);
  }

  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div>
          <Link to="/" className="logo">
            <img src="/img/logo_with_text.png" alt="Navbar logo" />
          </Link>
        </div>
        <Nav>
          <Link className="nav-link" to="/requests">
            Requests
          </Link>
          <Link className="nav-link" to="/patients">
            Patients
          </Link>
          <Link className="nav-link" to="/samples">
            Samples
          </Link>
          <Link className="nav-link" to="/cohorts">
            Cohorts
          </Link>
          <Link className="nav-link" to="/test">
            Test
          </Link>
        </Nav>
        {userEmail && (
          <div className="ms-auto d-none d-md-flex">
            <p className="m-auto">Logged in as {userEmail}</p>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm m-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </header>
    </>
  );
}
