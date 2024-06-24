import React from "react";
import { Link } from "react-router-dom";

export const TestDashboard = () => {
  return (
    <div className="text-center" style={{ margin: "5rem" }}>
      <h1>This is Dummy Dashboard!!</h1>
      <Link to="/onboarding/debts" className="btn btn-outline-dark mt-4">
        {"<"} Return
      </Link>
    </div>
  );
};
