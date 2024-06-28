import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { Budget } from "../components/Dashboard/Budget";
import { TrackExpenses } from "../components/Dashboard/TrackExpenses";
import { Category } from "../components/Dashboard/Category";
import styled from "styled-components";
import { Income } from "../components/Dashboard/Income";

export const DashboardPage = () => {
  return (
    <StyledMainSection>
      <Goals />
      <Category />
      <Budget />
      <TrackExpenses />
      <Income />
    </StyledMainSection>
  );
};

const StyledMainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: calc(100% - 4rem); /* Subtract the margins from the width */
  margin: 2rem;
`;