import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";
import { FinancialSuggestions } from "../components/Dashboard/FinancialSuggestions";
import styled from "styled-components";
import { IncomeAndDebts } from "../components/Dashboard/IncomeAndDebts";

export const DashboardPage = () => {
  return (
    <DashboardContainer>
      <Column>
        <Goals />
        <BalanceOfBudgetAndExpenses />
      </Column>
      <Column>
        <MonthlyTotalExpenses />
        <ExpendituresByCategory />
        <MonthlySavings />
        <IncomeAndDebts />
      </Column>
      <Column>
        <FinancialSuggestions />
      </Column>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 3vh 10vw 0 calc(10vw + 5vw);
  display: grid;
  grid-template-columns: 35% 35% 27%;
  grid-gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 3vh 5vw 0 5vw;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;