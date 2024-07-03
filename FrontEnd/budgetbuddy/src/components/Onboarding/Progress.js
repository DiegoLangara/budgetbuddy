import React from "react";
import { useLocation } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";

export const Progress = () => {
  const location = useLocation();

  // Define the steps and their order
  const steps = [
    { path: "/onboarding/goals" },
    { path: "/onboarding/incomes" },
    { path: "/onboarding/budgets" },
    { path: "/onboarding/debts" },
  ];

  // Determine the current step
  const currentStepIndex = steps.findIndex(
    (step) => location.pathname === step.path
  );

  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="container my-4 pt-1">
      <ProgressBar
        now={progressPercentage}
        label={`${Math.round(progressPercentage)}%`}
        striped
        animated
        style={{ height: "1.5rem" }}
      />
    </div>
  );
};
