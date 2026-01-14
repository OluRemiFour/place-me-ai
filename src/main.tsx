import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import { GoogleOAuthProvider } from '@react-oauth/google';

const basename = import.meta.env.BASE_URL;

// This should ideally be in an env variable
const GOOGLE_CLIENT_ID = "64188031313-vpoa5scv2n0OmDO2B2VFPv-RT8I-Iqworuksfl5.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
