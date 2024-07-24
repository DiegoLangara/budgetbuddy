import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    console.log("Fetched data:", data);
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
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [goals, setGoals] = useState(
    state.goals || [{ id: 1, goal_type_id: 0 }]
  );
  console.log(goals);
  const [editableGoalId, setEditableGoalId] = useState(null);
  const [goalErrors, setGoalErrors] = useState([]);
  const [savingGoalId, setSavingGoalId] = useState(null);

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
      setState({ ...state, goals: formattedGoals });
      setGoalErrors([]);
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

  const validateGoal = (goal) => {
    const error = {};
    if (!goal.goal_name) error.goal_name = "Input required";
    if (goal.goal_type_id === 0) error.goal_type_id = "Input required";
    if (!goal.target_date) error.target_date = "Input required";
    if (!goal.current_amount) error.current_amount = "Input required";
    if (!goal.target_amount) error.target_amount = "Input required";
    return error;
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

  const deleteGoalFromDatabase = async (user_id, token, id) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goal/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            goal_id: id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete goal from the database");
      }
      console.log(`Goal with ID ${id} deleted successfully from the database`);
    } catch (error) {
      console.error("Failed to delete goal:", error);
      throw error;
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGoalFromDatabase(user_id, token, id);
          const updatedGoals = goals.filter((goal) => goal.id !== id);
          setGoals(updatedGoals);
          setState({ ...state, goals: updatedGoals });
          if (editableGoalId === id) {
            setEditableGoalId(null);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Failed to delete goal from the database",
            "error"
          );
        }
      }
    });
  };

  const saveToDatabase = async (goal) => {
    console.log(
      "goal_id: " + goal.id + " token: " + token + " user_id: " + user_id
    );
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goal/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            goal_id: goal.id,
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(goal),
        }
      );
      console.log(JSON.stringify(goal));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);

      if (responseData.success) {
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
        position: "center",
        icon: "error",
        title: "Failed to save data",
        showConfirmButton: false,
        timer: 1200,
        width: "300px",
      });
    }
  };

  // const saveData = async (event) => {
  //   event.preventDefault();
  //   if (!validateGoals()) return;
  //   const combinedData = {
  //     ...state,
  //     goals: goals,
  //   };
  //   setState(combinedData);
  //   await saveToDatabase(combinedData);
  // };

  const handleSave = async (goal) => {
    const validationErrors = validateGoal(goal);
    if (Object.keys(validationErrors).length === 0) {
      setSavingGoalId(goal.id);
      await saveToDatabase(goal);
      setEditableGoalId(null);
      setSavingGoalId(null);
    } else {
      setGoalErrors(validationErrors);
    }
  };
  //     setGoalErrors((prevErrors) =>
  //       prevErrors.map((error, index) =>
  //         goal.id === goals[index].id ? goalError : error
  //       )
  //     );
  //     return;
  //   }
  //   setSavingGoalId(goal.id);
  //   await saveToDatabase(goal);
  //   setEditableGoalId(null);
  //   setSavingGoalId(null);
  //   setGoals((prevGoals) => prevGoals.map((g) => ({ ...g, editable: false })));
  // };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 0 0 .4rem",
        width: "100%",
      }}
    >
      {/* <Form onSubmit={saveData} className="my-2 pb-0"> */}
      <div className="d-flex justify-content-between mt-2 mb-3">
        <div>
          <h3 style={{ fontSize: "2.1rem" }}>Set Your Goals</h3>
          <p className="mb-1" style={{ fontSize: ".95rem" }}>
            What would you like to achieve?
          </p>
        </div>
        <div className="d-flex align-items-end ml-3 pb-2">
          <Link
            to="#"
            className="btn rounded-pill"
            onClick={addGoal}
            style={{
              fontSize: ".9rem",
              fontWeight: "bold",
              color: "Black",
              backgroundColor: "#eee",
              border: "1px solid gray",
              padding: ".6rem",
            }}
          >
            {goals.length === 0 ? "+ Create a Goal" : "+ Add More Goals"}
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
              style={{ minHeight: "auto", maxWidth: "50%" }}
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
                    <div className="form-row">
                      <div className="col-md-6 form-group mb-0">
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
                              disabled={editableGoalId !== goal.id}
                              style={{ fontSize: ".8rem" }}
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
                      <div className="col-md-6 form-group mb-0">
                        <Field label="Goal category">
                          <>
                            <div className="mt-0">
                              <select
                                className="form-select w-100 p-3 border border-secondary-subtle rounded"
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
                      <div className="col-md-6 form-group mb-0">
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
                              min={new Date().toISOString().split("T")[0]}
                              disabled={editableGoalId !== goal.id}
                              style={{ fontSize: ".8rem" }}
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
                      <div className="col-md-6 form-group mb-0">
                        <Field label="Saved amount">
                          <>
                            {/* <> */}
                            <div className="input-group">
                              <span
                                className="input-group-text bg-white"
                                style={{ fontSize: ".8rem" }}
                              >
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
                                min="100"
                                disabled={editableGoalId !== goal.id}
                                style={{ fontSize: ".8rem" }}
                                required
                              />
                            </div>
                            {/* {goal.current_amount_error && (
                                <div className="text-danger">
                                  {goal.current_amount_error}
                                </div>
                              )}
                            </> */}
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
                      <div className="col-md-6 form-group mb-0">
                        <Field label="Target amount">
                          <>
                            {/* <> */}
                            <div className="input-group">
                              <span
                                className="input-group-text bg-white"
                                style={{ fontSize: ".8rem" }}
                              >
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
                                min="100"
                                disabled={editableGoalId !== goal.id}
                                style={{ fontSize: ".8rem" }}
                                required
                              />
                            </div>
                            {/* {goal.target_amount_error && (
                                <div className="text-danger">
                                  {goal.target_amount_error}
                                </div>
                              )}
                            </> */}
                            {goalErrors[index]?.target_amount && (
                              <div className="text-danger">
                                {goalErrors[index]?.target_amount}
                              </div>
                            )}
                          </>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                {editableGoalId !== goal.id ? (
                  <button
                    className="btn btn-secondary btn-sm px-3 mr-2 mt-1"
                    type="button"
                    onClick={() => setEditableGoal(goal.id)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm px-3 mr-2 mt-1"
                    type="button"
                    onClick={() => handleSave(goal)}
                  >
                    Save
                  </button>
                )}
                {goal.deletable === 1 || index > 0 ? (
                  <button
                    className="btn btn-danger btn-sm mt-1"
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
      {/* <div className="d-flex justify-content-end">
          <BootstrapButton
            type="submit"
            className="btn btn-primary w-25 rounded-pill mt-3"
          >
            Save
          </BootstrapButton>
        </div> */}
      {/* </Form> */}
    </div>
  );
};
