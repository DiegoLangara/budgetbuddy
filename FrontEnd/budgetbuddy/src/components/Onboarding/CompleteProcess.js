import React from "react";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Logonn.png";
import "../../css/CompleteProcess.css";

export const CompleteProcess = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/home/dashboard");
  };

  return (
    <div className="complete-process-background">
      <Container className="d-flex align-items-center justify-content-center complete-process-background-container">
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
              <div className="content mt-5 mb-5 pb-3">
                <h1
                  className="text-left mt-5 mb-4"
                  style={{ fontSize: "3.7rem" }}
                >
                  You're All Set!
                </h1>
                <p className="text-left mb-4" style={{ fontSize: "1.1rem" }}>
                  A personalized dashboard has been created from the details you
                  have added. You may now start using BudgetBuddy.
                </p>
                <p className="text-left" style={{ fontSize: "1.1rem" }}>
                  Feel like you’ve missed a step or added the wrong details? You
                  may edit your onboarding details in your profile settings.
                </p>
              </div>
              <div className="d-flex justify-content-center mt-5 pt-5">
                <BootstrapButton
                  onClick={handleNavigate}
                  variant="primary"
                  className="w-100 submit-btn-complete"
                >
                  Proceed to Home
                </BootstrapButton>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};
