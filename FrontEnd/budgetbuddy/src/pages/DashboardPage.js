import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { Budget } from "../components/Dashboard/Budget";
import { TrackExpenses } from "../components/Dashboard/TrackExpenses";
import { Category } from "../components/Dashboard/Category";

export const DashboardPage = () => {
  return (
    <>
      <Goals />
      <Category />
      <Budget />
      <TrackExpenses />
    </>
  );
};
