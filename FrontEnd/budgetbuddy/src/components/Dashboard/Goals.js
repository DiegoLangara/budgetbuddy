import React from "react";
import ReactApexChart from "react-apexcharts";
import { GoalBarChart } from "../DashboardParts/GoalBarChart";

export const Goals = () => {
  const jsonData = [
    {
      title: "Buying a Toyota GR86",
      goal: 3000,
      savings: 2700,
    },
    {
      title: "Buying a Toyota GR86",
      goal: 3000,
      savings: 2700,
    },
    {
      title: "Buying a Toyota GR86",
      goal: 3000,
      savings: 2700,
    },
  ];

  return (
    <>
      <h3>Goals</h3>
      {jsonData.map((goal, index) => (
        <GoalBarChart
          key={index}
          description={goal.title}
          goal={goal.goal}
          savings={goal.savings}
        />
      ))}
    </>
  );
};
