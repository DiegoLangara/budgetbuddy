import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function fetchGoals(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

const goalTypeOptions = [
  { id: 0, name: "Select a category", disabled: true },
  { id: 1, name: "Savings" },
  { id: 2, name: "Emergency Fund" },
  { id: 3, name: "Vacation Fund" },
  { id: 4, name: "Education Fund" },
  { id: 5, name: "Home Purchase" },
  { id: 6, name: "Car Purchase" },
  { id: 7, name: "Wedding Fund" },
  { id: 8, name: "Gadget Purchase" },
  { id: 9, name: "Retirement Plan" },
  { id: 10, name: "Other" },
];

export const Goals = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [goals, setGoals] = useState(
    state.goals || [{ id: 1, goal_type_id: 0 }]
  );
  const [expandedGoalId, setExpandedGoalId] = useState(goals[0]?.id || 1);

  useEffect(() => {
    async function loadGoals() {
      const fetchedGoals = await fetchGoals(user_id, token);
      const formattedGoals = fetchedGoals.map((goal, index) => ({
        id: goal.goal_id || index + 1,
        goal_name: goal.goal_name || "",
        goal_type_id: goal.goal_type_id ?? 0,
        target_amount: goal.target_amount || "",
        current_amount: goal.current_amount || "",
        target_date: goal.target_date ? formatDate(goal.target_date) : "",
      }));
      setGoals(
        formattedGoals.length > 0
          ? formattedGoals
          : [{ id: 1, goal_type_id: 0 }]
      );
      setExpandedGoalId(formattedGoals.length > 0 ? formattedGoals[0]?.id : 1);
      setState({ ...state, goals: formattedGoals });
    }
    loadGoals();
  }, [user_id, token, setState]);

  const handleInputChange = (id, field, value) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const addGoal = () => {
    const newGoal = { id: goals.length + 1, goal_type_id: 0 };
    setGoals([...goals, newGoal]);
    setExpandedGoalId(newGoal.id);
  };

  const deleteGoal = (id) => {
    const confirmMessage = window.confirm("Are you sure to delete this item?");
    if (confirmMessage) {
      const updatedGoals = goals.filter((goal) => goal.id !== id);
      setGoals(updatedGoals);
      setState({ ...state, goals: updatedGoals });
      setExpandedGoalId(updatedGoals.length > 0 ? updatedGoals[0].id : null);
    }
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ goals: data.goals }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const saveData = async (event) => {
    event.preventDefault();
    const combinedData = {
      ...state,
      goals: goals,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/onboarding/incomes");
  };

  const toggleGoal = (id) => {
    setExpandedGoalId(expandedGoalId === id ? null : id);
  };

  return (
    <Form onSubmit={saveData}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <h3>Set Your Goals</h3>
              <Link to="/onboarding/incomes" className="btn btn-secondary">
                Skip to next
              </Link>
            </div>

            {goals.map((goal) => (
              <div key={goal.id} className="accordion mb-3">
                <div className="accordion-item border border-secondary-sutble">
                  <div
                    className="accordion-header"
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      cursor: "pointer",
                      background: "#e7e7e7",
                      padding: "0.5rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="accordion-title">Goal {goal.id}</h5>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        type="button"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {expandedGoalId === goal.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body p-2">
                        <Field label="Your goal">
                          <Input
                            type="text"
                            value={goal.goal_name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                goal.id,
                                "goal_name",
                                e.target.value
                              )
                            }
                            placeholder="ex. Buy a Tesla"
                          />
                        </Field>
                        <Field label="Goal category">
                          <div className="mt-0">
                            <select
                              className="form-select w-100 p-2 border border-secondary-subtle round round-2"
                              value={goal.goal_type_id || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  goal.id,
                                  "goal_type_id",
                                  Number(e.target.value)
                                )
                              }
                            >
                              {goalTypeOptions.map((option) => (
                                <option
                                  key={option.id}
                                  value={option.id}
                                  disabled={option.disabled}
                                >
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Field>
                        <Field label="Goal date">
                          <Input
                            type="date"
                            value={goal.target_date || ""}
                            onChange={(e) =>
                              handleInputChange(
                                goal.id,
                                "target_date",
                                e.target.value
                              )
                            }
                          />
                        </Field>
                        <Field label="How much have you saved?">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              type="number"
                              value={goal.current_amount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  goal.id,
                                  "current_amount",
                                  e.target.value
                                )
                              }
                              placeholder="ex. 5000"
                              className="form-control"
                              step="100"
                              min="100"
                            />
                          </div>
                        </Field>
                        <Field label="How much more do you need?">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              type="number"
                              value={goal.target_amount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  goal.id,
                                  "target_amount",
                                  e.target.value
                                )
                              }
                              placeholder="ex. 3000"
                              className="form-control"
                              step="100"
                              min="100"
                            />
                          </div>
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-center">
              <Link
                to="#"
                className="btn btn-outline-primary mt-3 mb-5 "
                onClick={addGoal}
              >
                {goals.length === 0 ? "Create a goal" : "Add another goal"}
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/onboarding/personal-details"
                className="btn btn-outline-secondary"
              >
                {"<"} Return
              </Link>
              <Button
                type="submit"
                className="btn btn-primary"
              >
                Save & Next {">"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
