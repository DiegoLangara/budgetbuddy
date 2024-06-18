import React from "react";
import styled from "styled-components";
import { Routes, Route, useLocation } from "react-router-dom";
import { Budget } from "../components/Onboarding/Budget";
import { Debts } from "../components/Onboarding/Debts";
import { Goals } from "../components/Onboarding/Goals";
import { Incomes } from "../components/Onboarding/Incomes";
import { PersonalDetails } from "../components/Onboarding/PersonalDetails";
import { Progress } from "../components/Onboarding/Progress";
import { Welcome } from "../components/Onboarding/Welcome";
import { TestDashboard } from "../components/Onboarding/TestDashboard";
import { OnboardingProvider } from "../Hooks/useOnboardingState";

export const OnboardingPage = () => {
  const location = useLocation();
  console.log("Current location:", location.pathname); // Debug current path

  return (
    <StyledOnboardingWrapper>
      <OnboardingProvider>
        <Progress />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="personal-details" element={<PersonalDetails />} />
          <Route path="goals" element={<Goals />} />
          <Route path="incomes" element={<Incomes />} />
          <Route path="budget" element={<Budget />} />
          <Route path="debts" element={<Debts />} />
          <Route path="test-dashboard" element={<TestDashboard />} />
        </Routes>
      </OnboardingProvider>
    </StyledOnboardingWrapper>
  );
};

const StyledOnboardingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  width: 630px;
  margin: 0 auto;
`;
