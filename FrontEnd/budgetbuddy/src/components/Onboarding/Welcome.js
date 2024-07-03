import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    navigate("/onboarding/personal-details");
  };

  return (
    <div
      className="container text-left"
      style={{ margin: "10rem auto", padding: "0 3rem" }}
    >
      <h1 style={{ fontSize: "3.5rem" }}>
        Easily manage your finances with us.
      </h1>
      <p style={{ fontSize: "1.1rem", margin: "3rem 0" }}>
        In order to provide the best budgeting services BudgetBuddy has to
        offer, it is optimal for you to fill in your data.
      </p>
      <div className="d-flex justify-content-center">
        <BootstrapButton
          onClick={startOnboarding}
          variant="primary"
          className="btn btn-dark btn-lg"
          style={{ width: "100%" }}
        >
          Start
        </BootstrapButton>
      </div>
    </div>
  );
};
