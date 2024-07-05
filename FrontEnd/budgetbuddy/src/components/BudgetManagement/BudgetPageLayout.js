import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

export const BudgetPageLayout = () => {
  return (
    <StyledDiv>
      <Link
        to="/home/goals-bm"
        className="btn btn-outline-secondary"
        style={{
          padding: "20% 0 30%",
          width: "10vw",
          height: "10vh",
        }}
      >
        Goals
      </Link>
      <Link
        to="/home/incomes-bm"
        className="btn btn-outline-secondary"
        style={{
          padding: "20% 0 30%",
          width: "10vw",
          height: "10vh",
        }}
      >
        Incomes
      </Link>
      <Link
        to="/home/budgets-bm"
        className="btn btn-outline-secondary"
        style={{
          padding: "20% 0 30%",
          width: "10vw",
          height: "10vh",
        }}
      >
        Budgets
      </Link>
      <Link
        to="/home/debts-bm"
        className="btn btn-outline-secondary"
        style={{
          padding: "20% 0 30%",
          width: "10vw",
          height: "10vh",
        }}
      >
        Debts
      </Link>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
`;
