import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { Budget } from "../components/Dashboard/Budget";
import { TrackExpenses } from "../components/Dashboard/TrackExpenses";

export const DashboardPage = () => {
  return (
    <>
      <Goals />
      <Budget />
      <TrackExpenses />
    </>
  );
};
