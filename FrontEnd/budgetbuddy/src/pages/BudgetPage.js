import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";
import "../css/BudgetPage.css";

export const BudgetPage = () => {
  const pageOptions = ["Goals", "Incomes", "Budgets", "Debts"];
  const pageLinks = ["goals-bm", "incomes-bm", "budgets-bm", "debts-bm"];

  return (
    <div
      className="container1"
      style={{
        width: "100%",
        padding: "1vh 10vw 3vh calc(10vw + 60px)",
        margin: "0 auto",
      }}
    >
      <nav className="shrinked-nav">
        <ul
          style={{ listStyle: "none", padding: "0" }}
          className="list-group d-flex"
        >
          {pageOptions.map((page, index) => (
            <li
              key={index}
              className="list-group-item"
              style={{
                border: "1px solid lightgray",
                borderRadius: "5% 5% 0 0",
              }}
            >
              <Link
                to={pageLinks[index]}
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                {page}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ width: "100%", display: "flex", flex: "1" }}>
        <aside style={{ width: "150px", padding: "0 1.5rem 0 0" }}>
          <nav>
            <ul
              style={{ listStyle: "none", padding: "0" }}
              className="list-group"
            >
              {pageOptions.map((page, index) => (
                <li key={index} className="list-group-item">
                  <Link
                    to={pageLinks[index]}
                    className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
                  >
                    {page}
                    <div>{" >"}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main style={{ flexBasis: "100%" }}>
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
    </div>
  );
};
