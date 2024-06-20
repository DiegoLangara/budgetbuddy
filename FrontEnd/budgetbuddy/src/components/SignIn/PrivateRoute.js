import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute() {
  const { currentUser, isFirstTime } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (isFirstTime) {
    return <Navigate to="/onboarding" />;
  }

  return <Outlet />;
}
