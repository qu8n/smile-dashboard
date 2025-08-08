import { useEffect } from "react";

export function LoginSuccessPage() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        "success",
        `${process.env.REACT_APP_REACT_SERVER_ORIGIN}`
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
