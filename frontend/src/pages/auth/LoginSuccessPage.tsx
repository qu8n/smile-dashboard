import { useEffect } from "react";
import { REACT_APP_REACT_SERVER_ORIGIN } from "../../shared/constants";

export default function LoginSuccessPage() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        "success",
        `${REACT_APP_REACT_SERVER_ORIGIN}/patients`
      );

      window.onload = () => {
        setTimeout(() => {
          window.close();
        }, 1000);
      };
    }
  }, []);

  return <p>You are logged in. :)</p>;
}
