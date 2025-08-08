import { Nav, NavLink } from "react-bootstrap";
import { Dispatch, SetStateAction } from "react";
import { useUserEmail } from "../../contexts/UserEmailContext";

export default function SmileNavBar() {
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
          <a href="/" className="logo">
            <img src="/img/logo_with_text.png" alt="Navbar logo" />
          </a>
        </div>
        <Nav>
          <NavLink href="/requests">Requests</NavLink>
          <NavLink href="/patients">Patients</NavLink>
          <NavLink href="/samples">Samples</NavLink>
          <NavLink href="/cohorts">Cohorts</NavLink>
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
