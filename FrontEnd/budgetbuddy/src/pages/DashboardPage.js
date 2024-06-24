import React from "react";
import { Goals } from "../components/Dashboard/Goals";

export const DashboardPage = () => {
  const jsonData = [
    {
      title: "Emergency Fund",
      goal: 5000,
      savings: 3200,
    },
    {
      title: "Vacation",
      goal: 2000,
      savings: 1500,
    },
    {
      title: "New Car",
      goal: 15000,
      savings: 4500,
    },
  ];

  return (
    <>
      <h1>DashboardPage TEST</h1>
      {jsonData.map((goal, index) => (
        <Goals
          key={index}
          description={goal.title}
          goal={goal.goal}
          savings={goal.savings}
        />
      ))}
    </>
  );
};
