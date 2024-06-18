import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./components/SignIn/App";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoadingProvider } from "./contexts/LandingContext";
import LoadingScreen from "./components/Common/loadingScreen";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <LoadingScreen />
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
