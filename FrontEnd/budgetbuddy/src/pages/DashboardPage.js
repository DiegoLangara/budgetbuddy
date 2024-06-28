import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { Budget } from "../components/Dashboard/Budget";
import { TrackExpenses } from "../components/Dashboard/TrackExpenses";
import { Category } from "../components/Dashboard/Category";
import styled from "styled-components";
import { Income } from "../components/Dashboard/Income";
import { FinancialSuggestions } from "../components/Dashboard/FinancialSuggestions";

export const DashboardPage = () => {
  return (
    <StyledMainSection>
      <Goals />
      <Category />
      <Budget />
      <TrackExpenses />
      <Income />
      <FinancialSuggestions />
    </StyledMainSection>
  );
};

const StyledMainSection = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: calc(100% - 4rem); /* Subtract the margins from the width */
  margin: 2rem;
`;