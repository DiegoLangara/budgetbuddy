import React from "react";
import styled from "styled-components";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";

export const DashboardPage = () => {

  return (
    <>
      <StyledMainSection>
        <Goals />
        <BalanceOfBudgetAndExpenses />
        <MonthlyTotalExpenses />
        <ExpendituresByCategory />
        <MonthlySavings />
      </StyledMainSection>
    </>
  );
};

const StyledMainSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 3vh 16.5vw 0 16.5vw;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;