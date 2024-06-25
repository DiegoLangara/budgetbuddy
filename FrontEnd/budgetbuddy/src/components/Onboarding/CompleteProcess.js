import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../OnboardingParts/Button";

export const CompleteProcess = () => {
  return (
    <div className="text-center" style={{ margin: "5rem" }}>
      <h1>Onboarding process completed!</h1>
      <p style={{ fontSize: "1.4rem", marginTop: "3rem" }}>
        You can always update your information on your Dashboard.
      </p>
      <div className="d-flex justify-content-between mt-4">
        <Link to="/onboarding/debts" className="btn btn-outline-dark mt-4">
          {"<"} Return
        </Link>
        <Button type="button" className="btn btn-primary  mt-4">
          Go to Dashboard {">"}
        </Button>
      </div>
    </div>
  );
};
