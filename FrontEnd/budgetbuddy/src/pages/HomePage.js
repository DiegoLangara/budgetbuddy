import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { BudgetPage } from './BudgetPage';
import { ExpensesPage } from './ExpensesPage';

export const HomePage = () => {

  return (
    <>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
      </Routes>
    </>
  );
}
