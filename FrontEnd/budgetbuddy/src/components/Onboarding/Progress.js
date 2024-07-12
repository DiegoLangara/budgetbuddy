import React from "react";
import { useLocation } from "react-router-dom";
import "../../css/Progress.css"; // Asegúrate de tener el archivo CSS en la ruta correcta

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

  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`progress-step ${index <= currentStepIndex ? "active" : ""}`}
        ></div>
      ))}
    </div>
  );
};
