import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../OnboardingParts/Button";
export const CompleteProcess = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/dashboard");
  };
  return (
    <div className="text-left" style={{ margin: "5rem" }}>
      <h1 style={{ fontSize: "3.5rem" }}>You're All Set!</h1>
      <p style={{ fontSize: "1.1rem", marginTop: "3rem" }}>
        A personalized dashboard has been created from the details you have
        added.
        <br />
        You may now start using BudgetBuddy.
      </p>
      <p style={{ fontSize: "1.1rem" }}>
        Feel like you’ve missed a step or added the wrong details? You may edit
        your Onboarding details in your Profile settings.
    <div className="text-left" style={{ margin: "5rem" }}>
      <h1 style={{ fontSize: "3.5rem" }}>You're All Set!</h1>
      <p style={{ fontSize: "1.1rem", marginTop: "3rem" }}>
        A personalized dashboard has been created from the details you have
        added.
        <br />
        You may now start using BudgetBuddy.
      </p>
      <p style={{ fontSize: "1.1rem" }}>
        Feel like you’ve missed a step or added the wrong details? You may edit
        your Onboarding details in your Profile settings.
      </p>
      <Button
        type="button"
        className="btn btn-primary mt-5 p-2 w-100"
        onClick={handleNavigate}
      >
        Proceed to Home
        Proceed to Home
      </Button>
    </div>
  );
};
