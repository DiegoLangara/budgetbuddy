import React from "react";
import { Routes, Route } from "react-router-dom";
import { Budgets } from "../components/Onboarding/Budgets";
import { Debts } from "../components/Onboarding/Debts";
import { Goals } from "../components/Onboarding/Goals";
import { Incomes } from "../components/Onboarding/Incomes";
import { PersonalDetails } from "../components/Onboarding/PersonalDetails";
// import { ProgressLayout } from "../components/Onboarding/ProgressLayout";
import { CompleteProcess } from "../components/Onboarding/CompleteProcess";
import { OnboardingProvider } from "../Hooks/useOnboardingState";

export const OnboardingPage = () => {
  return (
    <OnboardingProvider>
      <div>
        <Routes>
          <Route path="personal-details" element={<PersonalDetails />} />
          {/* <Route element={<ProgressLayout />}> */}
          <Route>
            <Route path="goals" element={<Goals />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="debts" element={<Debts />} />
          </Route>
          <Route path="complete-process" element={<CompleteProcess />} />
        </Routes>
      </div>
    </OnboardingProvider>
  );
};
