import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import "../../css/Goals.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

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

export const GoalsBM = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [goals, setGoals] = useState(
    state.goals || [{ id: 1, goal_type_id: 0 }]
  );
  const [editableGoalId, setEditableGoalId] = useState(null);

  // Fetch goals on component mount
  useEffect(() => {
    async function loadGoals() {
      const fetchedGoals = await fetchGoals(user_id, token);
      console.log("Fetched goal data:", fetchGoals); // Debug output
      const formattedGoals = fetchedGoals.map((goal, index) => ({
        id: goal.goal_id || index + 1,
        goal_name: goal.goal_name || "",
        goal_type_id: goal.goal_type_id ?? 0,
        target_amount: goal.target_amount || "",
        current_amount: goal.current_amount || "",
        deletable: goal.deletable || "",
        target_date: goal.target_date ? formatDate(goal.target_date) : "",
      }));
      // Sort goals by id in ascending order
      formattedGoals.sort((a, b) => a.id - b.id);

      setGoals(
        formattedGoals.length > 0
          ? formattedGoals
          : [{ id: 1, goal_type_id: 0 }]
      );
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
    const newId =
      goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1;
    const newGoal = { id: newId, goal_type_id: 0 };
    const updatedGoals = [...goals, newGoal];
    updatedGoals.sort((a, b) => a.id - b.id);
    setGoals(updatedGoals);
  };

  const setEditableGoal = (id) => {
    setEditableGoalId(id);
  };

  const deleteGoal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3A3B3C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedGoals = goals.filter((goal) => goal.id !== id);
        setGoals(updatedGoals);
        setState({ ...state, goals: updatedGoals });
        if (editableGoalId === id) {
          setEditableGoalId(null);
        }
      }
    });
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify({ goals: data.goals }),
        }
      );
      console.log(JSON.stringify({ goals: data.goals }));
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
    navigate("/home/budget");
  };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 0 0 .4rem",
        width: "100%",
      }}
    >
      <Form onSubmit={saveData} className="my-2 pb-0">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h3 style={{ fontSize: "2.1rem" }}>Set Your Goals</h3>
            <p className="mb-1" style={{ fontSize: ".95rem" }}>
              What would you like to achieve?
            </p>
          </div>
          <div className="d-flex align-items-end ml-3 pb-2">
            <Link
              to="#"
              className="btn btn-outline-secondary rounded-pill"
              onClick={addGoal}
              style={{ fontSize: ".9rem" }}
            >
              {goals.length === 0 ? "+ Create a goal" : "+ Add another goal"}
            </Link>
          </div>
        </div>
        <Container className="mx-0 px-0">
          <div className="d-flex px-0 row">
            {goals.map((goal, index) => (
              <Card
                key={index}
                className={`p-3 m-2 col card-bm ${
                  editableGoalId === goal.id ? "editable" : null
                }`}
                style={{ minHeight: "auto" }}
              >
                <div
                  key={goal.id}
                  className={`mb-0 ${
                    editableGoalId === goal.id ? "editable" : "non-editable"
                  }`}
                >
                  <div className="mt-1">
                    <div
                      className="mb-3"
                      style={{
                        padding: ".3rem 0",
                        // borderBottom: "1px solid black",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 style={{ margin: ".2rem 0" }}>
                          <strong>Goal {index + 1}</strong>{" "}
                          <span style={{ fontSize: "1rem" }}>
                            {goal.goal_name ? " - " + goal.goal_name : ""}
                          </span>
                        </h5>
                        <div></div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="form-row">
                          <div className="col-md-6 form-group mb-0">
                            <Field label="Your goal" className="mb-0">
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
                                disabled={editableGoalId !== goal.id}
                                style={{ fontSize: ".85rem" }}
                              />
                            </Field>
                          </div>
                          <div className="col-md-6 form-group mb-0">
                            <Field label="Goal category">
                              <div className="mt-0">
                                <select
                                  className="form-select w-100 p-2 border border-secondary-subtle rounded"
                                  value={goal.goal_type_id || 0}
                                  onChange={(e) =>
                                    handleInputChange(
                                      goal.id,
                                      "goal_type_id",
                                      Number(e.target.value)
                                    )
                                  }
                                  disabled={editableGoalId !== goal.id}
                                  style={{ fontSize: ".8rem" }}
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
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="col-md-6 form-group mb-0">
                            <Field label="Target date" className="col">
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
                                disabled={editableGoalId !== goal.id}
                                style={{ fontSize: ".85rem" }}
                              />
                            </Field>
                          </div>
                          <div className="col-md-6 form-group mb-0">
                            <Field label="Saved amount">
                              <div className="input-group">
                                <span
                                  className="input-group-text bg-white"
                                  style={{ fontSize: ".85rem" }}
                                >
                                  $
                                </span>
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
                                  disabled={editableGoalId !== goal.id}
                                  style={{ fontSize: ".85rem" }}
                                />
                              </div>
                            </Field>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="col-md-6 form-group mb-0">
                            <Field label="Target amount">
                              <div className="input-group">
                                <span
                                  className="input-group-text bg-white"
                                  style={{ fontSize: ".85rem" }}
                                >
                                  $
                                </span>
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
                                  disabled={editableGoalId !== goal.id}
                                  style={{ fontSize: ".85rem" }}
                                />
                              </div>
                            </Field>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary btn-sm px-3 mr-2"
                    type="button"
                    onClick={() => setEditableGoal(goal.id)}
                  >
                    Edit
                  </button>
                  {goal.deletable === 1 || index > 0 ? (
                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Container>
        <div className="d-flex justify-content-end">
          <BootstrapButton
            type="submit"
            className="btn btn-primary w-25 rounded-pill mt-3"
          >
            Save
          </BootstrapButton>
        </div>
      </Form>
    </div>
  );
};
