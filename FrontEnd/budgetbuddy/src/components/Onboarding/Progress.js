import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Progress = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav w-100 justify-content-between">
          <li className="nav-item">
            <Link
              to="/onboarding/personal-details"
              className={`nav-link ${
                location.pathname === "/onboarding/personal-details"
                  ? "active"
                  : ""
              }`}
            >
              Personal
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/onboarding/goals"
              className={`nav-link ${
                location.pathname === "/onboarding/goals" ? "active" : ""
              }`}
            >
              Goals
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/onboarding/incomes"
              className={`nav-link ${
                location.pathname === "/onboarding/incomes" ? "active" : ""
              }`}
            >
              Incomes
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/onboarding/budget"
              className={`nav-link ${
                location.pathname === "/onboarding/budget" ? "active" : ""
              }`}
            >
              Budget
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/onboarding/debts"
              className={`nav-link ${
                location.pathname === "/onboarding/debts" ? "active" : ""
              }`}
            >
              Debts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
