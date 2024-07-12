import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";
import { BudgetPage } from "./BudgetPage";
import { ExpensesPage } from "./ExpensesPage";
import { AddTransaction } from "./AddTransaction";
import { OnboardingProvider } from "../Hooks/useOnboardingState";

export const HomePage = () => {
  return (
    <>
      <OnboardingProvider>
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="budget/*" element={<BudgetPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="transactions" element={<AddTransaction />} />
          <Route path="*" element={<Navigate to="/home/dashboard" replace />} />
        </Routes>
      </OnboardingProvider>
    </>
  );
};
