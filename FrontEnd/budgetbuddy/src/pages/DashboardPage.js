import React, { useState, useEffect } from "react";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";
import { FinancialSuggestions } from "../components/Dashboard/FinancialSuggestions";
import styled from "styled-components";
import { IncomeAndDebts } from "../components/Dashboard/IncomeAndDebts";
import { ExpenseTableLatest } from "../components/Dashboard/ExpenseTableLatest";

const useMobileDetector = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export const DashboardPage = () => {
  const [buttonType, setButtonType] = useState('Graph');
  const isMobile = useMobileDetector();

  return (
    <>
      <StyledToggleContainer>
        <StyledToggleButton onClick={() => setButtonType('Graph')} active={buttonType === 'Graph'}>Graph</StyledToggleButton>
        <StyledToggleButton onClick={() => setButtonType('Insight')} active={buttonType === 'Insight'}>Insight</StyledToggleButton>
      </StyledToggleContainer>
      {isMobile ? (
        <DashboardContainer>
          {buttonType === 'Graph' ? (
            <>
              <Goals />
              <IncomeAndDebts />
              <MonthlySavings />
              <MonthlyTotalExpenses />
              <BalanceOfBudgetAndExpenses />
              <ExpendituresByCategory />
              <ExpenseTableLatest />
            </>
          ) : (
            <FinancialSuggestions />
          )}
        </DashboardContainer>
      ) : (
        <DashboardContainer>
          <Goals />
          <IncomeAndDebts />
          <MonthlySavings />
          <MonthlyTotalExpenses />
          <BalanceOfBudgetAndExpenses />
          <ExpendituresByCategory />
          <ExpenseTableLatest />
          <FinancialSuggestions />
        </DashboardContainer>
      )}
    </>
  );
};

const StyledToggleContainer = styled.div`
  display: none;
  justify-content: left;
  background-color: #CBE6FF;
  width: 175px;
  border-radius: 6px;
  padding: 5px;
  @media (max-width: 600px) {
    display: flex;
  }
`;

const StyledToggleButton = styled.button`
  width: 5rem;
  background-color: ${props => (props.active ? "#FFFFFF" : "#CBE6FF")};
  color: ${props => (props.active ? "#001E30" : "#3A608F")};
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;

  &:not(:last-child) {
    margin-right: 4px;
  }
`;

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
