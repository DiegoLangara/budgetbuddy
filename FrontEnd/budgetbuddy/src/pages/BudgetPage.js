import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";
import "../css/BudgetPage.css";

export const BudgetPage = () => {
  return (
    <div
      className="container1"
      style={{
        display: "flex",
        margin: "0 auto",
        padding: "1vh 16vw",
        // maxWidth: "1400px",
        width: "100%",
      }}
    >
      <nav className="shrinked-nav">
        <ul
          style={{ listStyle: "none", padding: "0" }}
          className="list-group d-flex"
        >
          <li
            className="list-group-item"
            style={{ border: "1px solid lightgray", borderRadius: "5% 5% 0 0" }}
          >
            <Link
              to="goals-bm"
              className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
            >
              Goals
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{ border: "1px solid lightgray", borderRadius: "5% 5% 0 0" }}
          >
            <Link
              to="incomes-bm"
              className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
            >
              Incomes
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{ border: "1px solid lightgray", borderRadius: "5% 5% 0 0" }}
          >
            <Link
              to="budgets-bm"
              className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
            >
              Budgets
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{ border: "1px solid lightgray", borderRadius: "5% 5% 0 0" }}
          >
            <Link
              to="debts-bm"
              className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
            >
              Debts
            </Link>
          </li>
        </ul>
      </nav>

      <aside style={{ width: "150px", padding: "0 1.5rem 0 0" }}>
        <nav>
          <ul
            style={{ listStyle: "none", padding: "0" }}
            className="list-group"
          >
            <li className="list-group-item">
              <Link
                to="goals-bm"
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                Goals
                <div>{" >"}</div>
              </Link>
            </li>
            <li className="list-group-item">
              <Link
                to="incomes-bm"
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                Incomes
                <div className="ml-2">{" >"}</div>
              </Link>
            </li>
            <li className="list-group-item">
              <Link
                to="budgets-bm"
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                Budgets
                <div className="ml-2">{" >"}</div>
              </Link>
            </li>
            <li className="list-group-item">
              <Link
                to="debts-bm"
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                Debts
                <div>{" >"}</div>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <Routes>
          <Route path="goals-bm" element={<GoalsBM />} />
          <Route path="incomes-bm" element={<IncomesBM />} />
          <Route path="budgets-bm" element={<BudgetsBM />} />
          <Route path="debts-bm" element={<DebtsBM />} />
          {/* Redirect to GoalsBM as the default page */}
          <Route path="*" element={<Navigate to="goals-bm" replace />} />
        </Routes>
      </main>
    </div>
  );
};
