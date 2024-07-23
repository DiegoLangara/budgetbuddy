import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";
import { FinancialSuggestions } from "../components/Dashboard/FinancialSuggestions";
import styled from "styled-components";
import { IncomeAndDebts } from "../components/Dashboard/IncomeAndDebts";
import { ExpenseTableLatest } from "../components/Dashboard/ExpenseTableLatest";

export const DashboardPage = () => {
  return (
    <>
      <DashboardContainer>
        <Goals />
        <ExpendituresByCategory />
        <MonthlySavings />
        <MonthlyTotalExpenses />
        <BalanceOfBudgetAndExpenses />
        <IncomeAndDebts />
        <FinancialSuggestions />
        <ExpenseTableLatest />
      </DashboardContainer>
    </>
  );
};

const DashboardContainer = styled.div`
  padding: 3vh 10vw 0 calc(10vw + 5vw);
  display: grid;
  grid-template-columns: 35% 35% 27%;
  grid-auto-rows: auto;
  grid-gap: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: 49% 49%;
  }

  @media (max-width: 850px) {
  padding: 3vh 10vw 0 calc(10vw + 5vw);
    display: flex;
    flex-flow: column nowrap;
    grid-template-columns: 1fr;
  }

  @media (max-width: 600px) {
    padding: 3vh 0 0 0;
  }
`;

