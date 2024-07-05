import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import logo from "../../Assets/Logonn.png";
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
  const [expandedGoalId, setExpandedGoalId] = useState(goals[0]?.id || 1);

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
    const newId =
      goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1;
    const newGoal = { id: newId, goal_type_id: 0 };
    const updatedGoals = [...goals, newGoal];
    updatedGoals.sort((a, b) => a.id - b.id);
    setGoals(updatedGoals);
    setExpandedGoalId(newGoal.id);
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
        setExpandedGoalId(updatedGoals.length > 0 ? updatedGoals[0].id : null);
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
    navigate("/onboarding/incomes");
  };

  const toggleGoal = (id) => {
    setExpandedGoalId(expandedGoalId === id ? null : id);
  };

  return (
    <div className="goals-background">
      <Container className="d-flex align-items-center justify-content-center goals-background-container">
        <Card className="card">
          <Card.Body className="mb-0">
            <div className="d-flex align-items-center mb-3">
              <img
                src={logo}
                alt="Budget Buddy Logo"
                className="img-black w-2vw"
              />
              <h3 className="text-left mb-0 ml-1">Budget Buddy</h3>
            </div>
            {/* <Progress /> */}
            <Form onSubmit={saveData} className="my-3 pb-0">
              <div className="container">
                <div className="row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-0">
                      <h3 style={{ fontSize: "2.2rem" }}>Set Your Goals</h3>
                    </div>
                    <p className="mb-3" style={{ fontSize: "1rem" }}>
                      What would you like to achieve?
                    </p>

                    {goals.map((goal, index) => (
                      <div key={goal.id} className="accordion mb-0">
                        <div className="mt-1">
                          <div
                            className="accordion-header mb-1"
                            onClick={() => toggleGoal(goal.id)}
                            style={{
                              cursor: "pointer",
                              // background: "#e7e7e7",
                              padding: ".3rem 0",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 style={{ margin: ".2rem 0" }}>
                                Goal {index + 1}{" "}
                                {expandedGoalId !== goal.id && goal.goal_name
                                  ? " - " + goal.goal_name
                                  : ""}
                              </h5>
                              {goal.deletable === 1 || index > 0 ? (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  type="button"
                                  onClick={() => deleteGoal(goal.id)}
                                >
                                  Delete
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          {expandedGoalId === goal.id && (
                            <div className="accordion-collapse collapse show">
                              <div className="accordion-body pt-2 px-0 container">
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
                                      />
                                    </Field>
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
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
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Goal date" className="col">
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
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="How much have you saved?">
                                      <div className="input-group">
                                        <span className="input-group-text bg-white">
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
                                        />
                                      </div>
                                    </Field>
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="How much more do you need?">
                                      <div className="input-group">
                                        <span className="input-group-text bg-white">
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
                                        />
                                      </div>
                                    </Field>
                                    <div></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="d-flex justify-content-center">
                      <Link to="#" className="mt-2" onClick={addGoal}>
                        {goals.length === 0
                          ? "Create a goal"
                          : "Add another goal"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="row btn-row">
                  <div className="col px-0 mt-5">
                    <div className="d-flex justify-content-between mt-3">
                      <Link
                        to="/home/budget"
                        className="btn btn-outline-secondary w-100"
                      >
                        Go back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
