import React from "react";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../css/Welcome.css";
import logo from "../../Assets/Logonn.png";

export const Welcome = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    navigate("/onboarding/personal-details");
  };

  return (
    <div className="welcome-background">
      <Container className="d-flex align-items-center justify-content-center welcome-background-container">
        <div>
          <Card className="card">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-4">
                <img
                  src={logo}
                  alt="Budget Buddy Logo"
                  className="img-black w-2vw"
                />
                <h3 className="text-left mb-0 ml-1">Budget Buddy</h3>
              </div>
              <div className="content mt-5 mb-5">
                <h1 className="text-left mb-4" style={{ fontSize: "3.7rem" }}>
                  Easily manage your finances with us.
                </h1>
                <p className="text-left mb-5">
                  In order to provide the best budgeting services BudgetBuddy
                  has to offer, it is optimal for you to fill in your data.
                </p>
              </div>
              <div className="d-flex justify-content-center mt-5 pt-2">
                <BootstrapButton
                  onClick={startOnboarding}
                  variant="primary"
                  className="w-100 submit-btn-welcome"
                >
                  Start
                </BootstrapButton>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};
