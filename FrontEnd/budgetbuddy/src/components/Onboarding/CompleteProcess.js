import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../OnboardingParts/Button";
export const CompleteProcess = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/home/dashboard");
  };
  return (
    <div className="text-center" style={{ margin: "5rem" }}>
      <h1>Onboarding process completed!</h1>
      <p style={{ fontSize: "1.4rem", marginTop: "3rem" }}>
        You can always update your information on your Dashboard.
      </p>
      <Button
        type="button"
        className="btn btn-primary mt-5 p-3"
        onClick={handleNavigate}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};
