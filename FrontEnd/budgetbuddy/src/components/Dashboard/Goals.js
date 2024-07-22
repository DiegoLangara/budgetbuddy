import React, { useEffect, useState } from "react";
import { GoalBarChart } from "../DashboardParts/GoalBarChart";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

// Fetch goals from the backend
async function fetchGoals(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/goals/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return [];
  }
}

export const Goals = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (token && user_id) {
      async function loadGoals() {
        const fetchedGoals = await fetchGoals(user_id, token);
        const formattedGoals = fetchedGoals.map((goal, index) => ({
          id: goal.goal_id || index + 1,
          goal_name: goal.goal_name || "",
          target_amount: goal.target_amount || 0,
          current_amount: goal.current_amount || 0,
        }));
        // Sort goals by id in ascending order
        formattedGoals.sort((a, b) => a.id - b.id);

        setGoals(
          formattedGoals.length > 0
            ? formattedGoals
            : [{ id: 1, goal_name: "No goals available", target_amount: 0, current_amount: 0 }]
        );
      }
      loadGoals();
    }
  }, [user_id, token]);

  return (
    <StyledGoalWrapper>
      <StyledTitle>Goals</StyledTitle>
      {goals.map((goal) => (
        <StyledGoalBarChart
          key={goal.id}
          description={goal.goal_name}
          goal={goal.target_amount}
          savings={goal.current_amount}
        />
      ))}
    </StyledGoalWrapper>
  );
};

const StyledGoalWrapper = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  width: 100%;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;

const StyledTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 2rem;
`;

const StyledGoalBarChart = styled(GoalBarChart)`
  margin: 1rem 0;
`;
