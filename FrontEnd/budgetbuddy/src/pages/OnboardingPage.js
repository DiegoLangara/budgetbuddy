import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Budgets } from "../components/Onboarding/Budgets";
import { Debts } from "../components/Onboarding/Debts";
import { Goals } from "../components/Onboarding/Goals";
import { Incomes } from "../components/Onboarding/Incomes";
import { PersonalDetails } from "../components/Onboarding/PersonalDetails";
import { ProgressLayout } from "../components/Onboarding/ProgressLayout";
import { CompleteProcess } from "../components/Onboarding/CompleteProcess";
import { OnboardingProvider } from "../Hooks/useOnboardingState";

export const OnboardingPage = () => {
  return (
    <OnboardingProvider>
      <StyledOnboardingWrapper>
        <Routes>
          <Route path="personal-details" element={<PersonalDetails />} />
          <Route element={<ProgressLayout />}>
            <Route path="goals" element={<Goals />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="debts" element={<Debts />} />
          </Route>
          <Route path="complete-process" element={<CompleteProcess />} />
        </Routes>
      </StyledOnboardingWrapper>
    </OnboardingProvider>
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
