import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"; // Asegúrate de importar LoginPage
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import PrivateRoute from "./components/SignIn/PrivateRoute";
import Signup from "./components/SignIn/Signup";
import ForgotPassword from "./components/SignIn/ForgotPassword";
import UpdateProfile from "./components/SignIn/UpdateProfile";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding/*" element={<OnboardingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
