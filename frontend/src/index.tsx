import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { LicenseManager } from "ag-grid-enterprise";

LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_LICENSE_KEY || "");

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console[dot]log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
