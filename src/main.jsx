import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { Provider } from "react-redux";
import { store } from "./Utility/store.jsx";
// import UnsecuredPage from "./Pages/UnsecuredPage/Unsecured.jsx";
// import { BrowserRouter, Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
);
