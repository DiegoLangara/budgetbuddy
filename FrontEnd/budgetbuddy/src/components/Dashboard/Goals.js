import React, { useEffect, useState } from "react";
import { GoalBarChart } from "../DashboardParts/GoalBarChart";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fetch goals from the backend
async function fetchGoals(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/`,
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
          goal_type_id: goal.goal_type_id ?? 0,
          target_amount: goal.target_amount || 0,
          current_amount: goal.current_amount || 0,
          deletable: goal.deletable || 0,
          target_date: goal.target_date ? formatDate(goal.target_date) : "",
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
      <h3>Goals</h3>
      {goals.map((goal) => (
        <GoalBarChart
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
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
`;