import React from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";
import { BudgetPage } from "./BudgetPage";
import { ExpensesPage } from "./ExpensesPage";
import { GoalsBM } from "../components/BudgetManagement/GoalsBM";
import { IncomesBM } from "../components/BudgetManagement/IncomesBM";
import { BudgetsBM } from "../components/BudgetManagement/BudgetsBM";
import { DebtsBM } from "../components/BudgetManagement/DebtsBM";
import { OnboardingProvider } from "../Hooks/useOnboardingState";

export const HomePage = () => {
  return (
    <>
      <OnboardingProvider>
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="goals-bm" element={<GoalsBM />} />
          <Route path="incomes-bm" element={<IncomesBM />} />
          <Route path="budgets-bm" element={<BudgetsBM />} />
          <Route path="debts-bm" element={<DebtsBM />} />
          <Route path="expenses" element={<ExpensesPage />} />
        </Routes>
      </OnboardingProvider>
    </>
  );
};
