import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { WelcomePage } from "./pages/WelcomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SupportPage } from "./pages/SupportPage";
import PrivateRoute from "./components/SignIn/PrivateRoute";
import Signup from "./components/SignIn/Signup";
import ForgotPassword from "./components/SignIn/ForgotPassword";
import UpdateProfile from "./components/SignIn/UpdateProfile";
import "bootstrap/dist/css/bootstrap.min.css";
//anadir css aca. 
import "./css/global.css";

import { HomePage } from "./pages/HomePage";
import { useMediaQuery, CssBaseline, Box } from "@mui/material";
import { Header } from "./components/Common/Header";
import { Sidebar } from "./components/Common/Sidebar";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding/welcome" element={<WelcomePage />} />
          <Route
            path="/onboarding/*"
            element={
              <PrivateRoute>
                <OnboardingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <SupportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/home/*"
            element={
              <PrivateRoute>
                <CssBaseline />
                <Header toggleDrawer={toggleDrawer} />
                <Box display="flex">
                  <Sidebar
                    variant={isMobile ? "temporary" : "persistent"}
                    open={isMobile ? drawerOpen : true}
                    toggleDrawer={toggleDrawer}
                    drawerwidth={224}
                  />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      width: { sm: `calc(100% - 224px)` },
                    }}
                  >
                    <HomePage />
                  </Box>
                </Box>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
