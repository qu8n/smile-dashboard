import { REACT_APP_EXPRESS_SERVER_ORIGIN } from "../shared/constants";

export function openLoginPopup() {
  const width = 800;
  const height = 800;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    `${REACT_APP_EXPRESS_SERVER_ORIGIN}/auth/login`,
    "_blank",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
  );
}
