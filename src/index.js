import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import ArbApp from "./ArbApp";

//const rootElement = document.getElementById("root");
//ReactDOM.render(
// <StrictMode>
//   <App />
// </StrictMode>,
// rootElement
//);
ReactDOM.render(<ArbApp />, document.getElementById("root"));
//ReactDOM.render(<App />, document.getElementById("root"));
