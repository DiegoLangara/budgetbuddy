import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";
import { useTheme, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import "../css/BudgetPage.css";

const Container = styled.div`
  width: 100%;
  padding: ${(props) =>
    props.isMobile ? "1vh" : "1vh 10vw 3vh calc(10vw + 60px)"};
  margin: 0 auto;
`;

const ShrinkedNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
    gap: ${(props) => (props.isMobile ? "0.5rem" : "0")};
  }

  .list-group-item {
    border: 1px solid lightgray;
    border-radius: 5% 5% 0 0;
  }
`;

const Aside = styled.aside`
  width: ${(props) => (props.isMobile ? "100%" : "150px")};
  padding: ${(props) => (props.isMobile ? "0" : "0 1.5rem 0 0")};
  margin-bottom: ${(props) => (props.isMobile ? "1rem" : "0")};

  nav ul {
    list-style: none;
    padding: 0;
  }

  .list-group-item {
    margin-bottom: ${(props) => (props.isMobile ? "0.5rem" : "0")};
  }
`;

export const BudgetPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pageOptions = ["Goals", "Incomes", "Budgets", "Debts"];
  const pageLinks = ["goals-bm", "incomes-bm", "budgets-bm", "debts-bm"];

  return (
    <Container isMobile={isMobile}>
      <ShrinkedNav isMobile={isMobile}>
        <ul className="list-group">
          {pageOptions.map((page, index) => (
            <li key={index} className="list-group-item">
              <Link
                to={pageLinks[index]}
                className="px-0 mx-0 d-flex text-decoration-none align-items-center justify-content-between"
              >
                {page}
              </Link>
            </li>
          ))}
        </ul>
      </ShrinkedNav>

      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "1",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Aside isMobile={isMobile}>
          <nav>
            <ul className="list-group">
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
        </Aside>
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
    </Container>
  );
};
