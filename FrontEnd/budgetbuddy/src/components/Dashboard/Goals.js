import React from "react";
import { GoalBarChart } from "../DashboardParts/GoalBarChart";
import styled from "styled-components";

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
    <StyledGoalWrapper>
      <h3>Goals</h3>
      {jsonData.map((goal, index) => (
        <GoalBarChart
          key={index}
          description={goal.title}
          goal={goal.goal}
          savings={goal.savings}
        />
      ))}
    </StyledGoalWrapper>
  );
};

const StyledGoalWrapper = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 1 / 3;
`;
