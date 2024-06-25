import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    navigate("/onboarding/personal-details");
  };

  return (
    <div className="container text-center" style={{ margin: "10rem" }}>
      <h1>Welcome to BudgetBuddy!!</h1>
      <p style={{ margin: "3rem" }}>
        In order to provide the best budgeting services BudgetBuddy has to
        offer, it is optimal for you to input your data.
      </p>
      <BootstrapButton
        onClick={startOnboarding}
        variant="primary"
        className="btn btn-dark btn-lg"
      >
        Start
      </BootstrapButton>
    </div>
  );
};
