import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";

export const Goals = () => {
  const [state, setState] = useOnboardingState();
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: state,
  });
  const navigate = useNavigate();
  const [goals, setGoals] = useState(state.goals || [{ id: 1 }]);
  // Track expanded goal of accordion, and open the first item by default
  const [expandedGoalId, setExpandedGoalId] = useState(goals[0]?.id || null);

  useEffect(() => {
    goals.forEach((goal, index) => {
      if (state.goals && state.goals[index]) {
        setValue(`goal_${goal.id}`, state.goals[index].goal);
        setValue(
          `goalSavedAmount_${goal.id}`,
          state.goals[index].goalSavedAmount
        );
        setValue(`goalAmount_${goal.id}`, state.goals[index].goalAmount);
        setValue(`goalDate_${goal.id}`, state.goals[index].goalDate);
      }
    });
  }, [goals, setValue, state.goals]);

  const addGoal = () => {
    const newGoal = { id: goals.length + 1 };
    setGoals([...goals, newGoal]);
    // Expand the newly added goal
    setExpandedGoalId(newGoal.id);
  };

  const deleteGoal = (id) => {
    const confirmMessage = window.confirm("Are you sure to delete this item?");
    if (confirmMessage === true) {
      // Update both "goals" and "savedGoals"(table) independently
      const updatedGoals = goals.filter((goal) => goal.id !== id);
      setGoals(updatedGoals);
      // const updatedSavedGoals = savedGoals.filter((goal) => goal.id !== id);
      // setSavedGoals(updatedSavedGoals);

      // Update the state with the new updatedGoals
      setState({ ...state, goals: updatedGoals });

      // Adjust expanded goal if the current expanded goal is deleted
      if (expandedGoalId === id && updatedGoals.length > 0) {
        setExpandedGoalId(updatedGoals[0].id);
      } else if (updatedGoals.length === 0) {
        setExpandedGoalId(null);
      }
    }
  };

  const saveToDatabase = async (data) => {
    try {
      // replace with the real API
      const response = await fetch("/api/saveGoals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const saveData = async (data) => {
    const combinedData = {
      ...state,
      goals: goals.map((goal) => ({
        id: goal.id,
        goal: data[`goal_${goal.id}`],
        goalSavedAmount: data[`goalSavedAmount_${goal.id}`],
        goalAmount: data[`goalAmount_${goal.id}`],
        goalDate: data[`goalDate_${goal.id}`],
      })),
    };
    console.log(data);
    console.log(combinedData);

    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/onboarding/incomes");
  };

  const toggleGoal = (id) => {
    setExpandedGoalId(expandedGoalId === id ? null : id);
  };

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <StyledTitleSkipWrapper>
        <h3>Set Your Goals</h3>
        <StyledLink to="/onboarding/test-dashboard">
          Skip to dashboard
        </StyledLink>
      </StyledTitleSkipWrapper>

      {goals.map((goal, index) => (
        <StyledGoalAccordion key={goal.id}>
          <StyledAccordionHeader>
            <HeaderContent onClick={() => toggleGoal(goal.id)}>
              <legend style={{ fontWeight: "bold", marginBottom: "0" }}>
                Goal {index + 1}
              </legend>
            </HeaderContent>
            <StyledDeleteBtn type="button" onClick={() => deleteGoal(goal.id)}>
              Delete
            </StyledDeleteBtn>
          </StyledAccordionHeader>
          {expandedGoalId === goal.id && (
            <StyledAccordionContent>
              <Field label="Your goal">
                <Input
                  {...register(`goal_${goal.id}`)}
                  type="text"
                  id={`goal-${goal.id}`}
                  placeholder="ex. To buy a car"
                />
              </Field>
              <Field label="Goal date">
                <Input
                  {...register(`goalDate_${goal.id}`)}
                  type="date"
                  id={`goal-date-${goal.id}`}
                />
              </Field>
              <Field label="How much have you saved?">
                <>
                  <span>$</span>
                  <Input
                    {...register(`goalSavedAmount_${goal.id}`)}
                    type="number"
                    id={`goal-saved-amount-${goal.id}`}
                    placeholder="ex. 5000"
                    step="100"
                    min="100"
                  />
                </>
              </Field>
              <Field label="How much more do you need?">
                <>
                  <span>$</span>
                  <Input
                    {...register(`goalAmount_${goal.id}`)}
                    type="number"
                    id={`goal-amount-${goal.id}`}
                    placeholder="ex. 3000"
                    step="100"
                    min="100"
                  />
                </>
              </Field>
            </StyledAccordionContent>
          )}
        </StyledGoalAccordion>
      ))}
      <Link
        onClick={addGoal}
        style={{
          marginTop: "1.5rem",
          marginBottom: "5rem",
          display: "block",
          textAlign: "center",
        }}
      >
        {goals.length === 0 ? "Creat a goal" : "Add another goal"}
      </Link>

      <StyledBottomBtnWrapper>
        <StyledLink to="/onboarding/personal-details">{"<"} Return</StyledLink>
        <Button type="submit" style={{ padding: "0 .5rem" }}>
          Save & Next {">"}
        </Button>
      </StyledBottomBtnWrapper>
    </Form>
  );
};

const StyledTitleSkipWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const StyledGoalAccordion = styled.div`
  margin: 0.3rem 0 0.7rem;
`;

const StyledAccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f7f7f7;
  padding: 0.3rem 0.5rem;
  border: 1px solid #bbb;
  border-radius: 4px;

  &:hover {
    background: #e7e7e7;
  }
`;

const HeaderContent = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const StyledAccordionContent = styled.div`
  padding: 0.5rem 1rem 1.2rem;
  border: 1px solid #bbb;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background: #fff;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.7rem;

  .buttons {
    grid-column: 1/-1;
  }
`;

const StyledDeleteBtn = styled(Button)`
  margin: 0 !important;
  padding: 0.3rem 0.5rem;
  font-size: 0.95rem;

  &:hover {
    background-color: rgb(100, 100, 100);
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.4rem;
  margin: 0 0 1.5rem;
  font-weight: bold;
  text-decoration: none;
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: lightgray;
    text-decoration: none;
  }
`;

const StyledBottomBtnWrapper = styled.div`
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
`;
