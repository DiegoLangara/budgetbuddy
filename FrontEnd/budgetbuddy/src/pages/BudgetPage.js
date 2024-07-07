import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";

export const BudgetPage = () => {
  return (
    <div
      style={{
        display: "flex",
        margin: "0 auto",
        padding: "1vh auto",
        // maxWidth: "1400px",
        width: "100%",
      }}
    >
      <aside style={{ minWidth: "130px" }}>
        <nav>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li>
              <Link
                to="goals-bm"
                className="px-2 mx-0 btn btn-outline-secondary d-flex text-decoration-none align-items-center justify-content-between"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-bullseye"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                  <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
                <div style={{ justifySelf: "start" }}>{"Goals"}</div>
                <div>{" >"}</div>
              </Link>
            </li>
            <li>
              <Link
                to="incomes-bm"
                className="px-2 mx-0 btn btn-outline-secondary d-flex text-decoration-none align-items-center justify-content-between"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-cash-coin"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
                  />
                  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                </svg>
                Incomes
                <div>{" >"}</div>
              </Link>
            </li>
            <li>
              <Link
                to="budgets-bm"
                className="px-2 mx-0 btn btn-outline-secondary d-flex text-decoration-none align-items-center justify-content-between"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-wallet2"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                </svg>
                Budgets
                <div>{" >"}</div>
              </Link>
            </li>
            <li>
              <Link
                to="debts-bm"
                className="px-2 mx-0 btn btn-outline-secondary d-flex text-decoration-none align-items-center justify-content-between"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-credit-card"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                  <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                </svg>
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
