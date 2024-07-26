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
import { Progress } from "./Progress";

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
  const [goalErrors, setGoalErrors] = useState([]);

  // Fetch goals on component mount
  useEffect(() => {
    async function loadGoals() {
      const fetchedGoals = await fetchGoals(user_id, token);
      // console.log("Fetched goal data:", fetchGoals); // Debug output
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

  const handleNumberInputChange = (id, field, value) => {
    let errorField = field + "_error";
    let errorMessage = "";

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, [field]: value, [errorField]: errorMessage }
          : goal
      )
    );
  };

  const validateGoals = () => {
    const errors = goals.map((goal) => {
      const error = {};
      if (!goal.goal_name) error.goal_name = "Input required";
      if (goal.goal_type_id === 0) error.goal_type_id = "Input required";
      if (!goal.target_date) error.target_date = "Input required";
      if (!goal.current_amount) error.current_amount = "Input required";
      if (!goal.target_amount) error.target_amount = "Input required";
      return error;
    });
    setGoalErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
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

      if (responseData.success) {
        navigate("/onboarding/incomes");
        Swal.fire({
          position: "center",
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1200,
          width: "300px",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1200,
          width: "300px",
        });
      }
    } catch (error) {
      console.error("Failed to save data:", error);
      Swal.fire({
        position: "bottom-start",
        icon: "error",
        title: "Failed to save data",
        showConfirmButton: false,
        timer: 1200,
        width: "300px",
      });
    }
  };

  const saveData = async (event) => {
    event.preventDefault();
    if (!validateGoals()) return;
    const combinedData = {
      ...state,
      goals: goals,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
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
            <Progress />
            <Form onSubmit={saveData} className="my-3 pb-0">
              <div className="container">
                <div className="row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-0">
                      <h3 style={{ fontSize: "2.2rem" }}>Set Your Goals</h3>
                      <Link
                        to="/onboarding/incomes"
                        className="btn btn-outline-secondary"
                      >
                        Skip for now
                      </Link>
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
                                <a
                                  href="#/"
                                  onClick={() => deleteGoal(goal.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    className="bi bi-trash3"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                  </svg>
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          {expandedGoalId === goal.id && (
                            <div className="accordion-collapse collapse show">
                              <div className="accordion-body pt-2 px-0 container">
                                <div className="form-row">
                                  <div className="col-md-6 mb-0">
                                    <Field label="Your goal" className="mb-0">
                                      <>
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
                                          required
                                        />
                                        {goalErrors[index]?.goal_name && (
                                          <div className="text-danger">
                                            {goalErrors[index]?.goal_name}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                  <div className="col-md-6 mb-0">
                                    <Field label="Goal category">
                                      <>
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
                                            required
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
                                        {goalErrors[index]?.goal_type_id && (
                                          <div className="text-danger">
                                            {goalErrors[index]?.goal_type_id}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 mb-0">
                                    <Field label="Target date" className="col">
                                      <>
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
                                          min={
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                          }
                                          required
                                        />
                                        {goalErrors[index]?.target_date && (
                                          <div className="text-danger">
                                            {goalErrors[index]?.target_date}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                  <div className="col-md-6 mb-0">
                                    <Field label="Saved amount">
                                      <>
                                        <>
                                          <div className="input-group">
                                            <span className="input-group-text bg-white">
                                              $
                                            </span>
                                            <Input
                                              type="number"
                                              value={goal.current_amount || ""}
                                              onChange={(e) =>
                                                handleNumberInputChange(
                                                  goal.id,
                                                  "current_amount",
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "e") {
                                                  e.preventDefault();
                                                }
                                              }}
                                              placeholder="ex. 5000"
                                              className="form-control"
                                              step="100"
                                              min="0"
                                              required
                                            />
                                          </div>
                                          {goal.current_amount_error && (
                                            <div className="text-danger">
                                              {goal.current_amount_error}
                                            </div>
                                          )}
                                        </>
                                        {goalErrors[index]?.current_amount && (
                                          <div className="text-danger">
                                            {goalErrors[index]?.current_amount}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 mb-0">
                                    <Field label="Target amount">
                                      <>
                                        <>
                                          <div className="input-group">
                                            <span className="input-group-text bg-white">
                                              $
                                            </span>
                                            <Input
                                              type="number"
                                              value={goal.target_amount || ""}
                                              onChange={(e) =>
                                                handleNumberInputChange(
                                                  goal.id,
                                                  "target_amount",
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "e") {
                                                  e.preventDefault();
                                                }
                                              }}
                                              placeholder="ex. 3000"
                                              className="form-control"
                                              step="100"
                                              min="0"
                                              required
                                            />
                                          </div>
                                          {goal.target_amount_error && (
                                            <div className="text-danger">
                                              {goal.target_amount_error}
                                            </div>
                                          )}
                                        </>
                                        {goalErrors[index]?.target_amount && (
                                          <div className="text-danger">
                                            {goalErrors[index]?.target_amount}
                                          </div>
                                        )}
                                      </>
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

                    {/* <div className="d-flex justify-content-center">
                      <Link to="#" className="mt-2" onClick={addGoal}>
                        {goals.length === 0
                          ? "Create a goal"
                          : "Add more goals"}
                      </Link>
                    </div> */}
                  </div>
                </div>

                <div className="row btn-row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between mt-5 pt-1">
                      <Link
                        to="/onboarding/personal-details"
                        className="btn btn-outline-secondary w-50"
                      >
                        Go back
                      </Link>
                      <BootstrapButton
                        type="submit"
                        className="btn btn-primary w-50 ml-3"
                      >
                        Save
                      </BootstrapButton>
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
