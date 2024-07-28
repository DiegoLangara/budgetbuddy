import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Input } from "../OnboardingParts/Input";
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
    // console.error("Failed to fetch goals:", error);
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
    state.goals || [{ goal_id: 1, goal_type_id: 0 }]
  );
  // console.log(goals);
  const [editableGoalId, setEditableGoalId] = useState(null);
  const [goalErrors, setGoalErrors] = useState([]);
  const [savingGoalId, setSavingGoalId] = useState(null);
  const [isNewGoal, setIsNewGoal] = useState(false);
  const [addedGoal, setAddedGoal] = useState([]);

  // Fetch goals on component mount
  useEffect(() => {
    async function loadGoals() {
      const fetchedGoals = await fetchGoals(user_id, token);
      // console.log("Fetched goal data:", fetchGoals); // Debug output
      const formattedGoals = fetchedGoals.map((goal, index) => ({
        goal_id: goal.goal_id || index + 1,
        goal_name: goal.goal_name || "",
        goal_type_id: goal.goal_type_id ?? 0,
        target_amount: goal.target_amount || "",
        current_amount: goal.current_amount || "",
        deletable: goal.deletable || "",
        target_date: goal.target_date ? formatDate(goal.target_date) : "",
      }));
      // Sort goals by id in ascending order
      formattedGoals.sort((a, b) => a.goal_id - b.goal_id);

      setGoals(
        formattedGoals.length > 0
          ? formattedGoals
          : [{ goal_id: 1, goal_type_id: 0 }]
      );
      setState({ ...state, goals: formattedGoals });
      setGoalErrors([]);
    }
    loadGoals();
  }, [user_id, token, setState]);

  const handleInputChange = (goal_id, field, value) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.goal_id === goal_id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const handleNumberInputChange = (goal_id, field, value) => {
    let errorMessage;

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.goal_id === goal_id ? { ...goal, [field]: value } : goal
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
      goals.length > 0 ? Math.max(...goals.map((g) => g.goal_id)) + 1 : 1;
    const newGoal = { goal_id: newId, goal_type_id: 0 };
    const updatedGoals = [...goals, newGoal];
    updatedGoals.sort((a, b) => a.goal_id - b.goal_id);
    setGoals(updatedGoals);
    setIsNewGoal(true);
  };

  const setEditableGoal = (goal_id) => {
    setEditableGoalId(goal_id);
  };

  const deleteGoalFromDatabase = async (user_id, token, goal_id) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goal/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            goal_id: goal_id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete goal from the database");
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
      throw error;
    }
  };

  const deleteGoal = (goal_id) => {
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
          await deleteGoalFromDatabase(user_id, token, goal_id);
          const updatedGoals = goals.filter((goal) => goal.goal_id !== goal_id);
          setGoals(updatedGoals);
          setState({ ...state, goals: updatedGoals });
          if (editableGoalId === goal_id) {
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

  // save(update) existing item
  const updateData = async (goal) => {
    // Create a copy of the goal object without the error fields
    const { current_amount_error, target_amount_error, ...goalWithoutErrors } =
      goal;

    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goal/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            goal_id: goal.goal_id,
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(goalWithoutErrors),
        }
      );
      // console.log(JSON.stringify(goalWithoutErrors));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      // console.log("Data saved successfully:", responseData);

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

  const handleSave = async (goal) => {
    const validationErrors = validateGoals(goal);
    if (Object.keys(validationErrors).length === 0) {
      setSavingGoalId(goal.goal_id);
      await updateData(goal);
      setEditableGoalId(null);
      setSavingGoalId(null);
      setIsNewGoal(false);
    } else {
      setGoalErrors(validationErrors);
    }
  };

  // save new item
  const saveToDatabase = async (goal) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goal/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(goal),
        }
      );
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

  const saveData = async (goal) => {
    if (!validateGoals()) return;
    console.log(goal);
    // Transform data to the required schema
    const transformedGoal = {
      goal_id: goal.goal_id,
      goal_name: goal.goal_name || null,
      goal_type_id: goal.goal_type_id,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deletable: goal.deletable,
      target_date: formatDate(goal.target_date) || null,
    };
    setAddedGoal(transformedGoal);
    await saveToDatabase(addedGoal);
    setIsNewGoal(false);
  };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 0 0 .4rem",
        width: "100%",
      }}
    >
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
      <div className="container-bm">
        {goals.map((goal, index) => (
          <div
            key={index}
            className={`p-3 m-0 card-bm ${
              editableGoalId === goal.goal_id ? "editable" : null
            }`}
            style={{ minHeight: "auto" }}
          >
            <div
              key={goal.goal_id}
              className={`card-content-bm mb-0 ${
                editableGoalId === goal.goal_id ? "editable" : "non-editable"
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
                    <h5
                      style={{
                        margin: goal.goal_name ? ".2rem 0" : "1.75rem 0 .2rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>
                        <strong>{goal.goal_name ? goal.goal_name : ""}</strong>
                      </span>
                    </h5>
                    <div></div>
                  </div>
                </div>
                <div>
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="Your goal" className="mb-0">
                        <>
                          <Input
                            type="text"
                            value={goal.goal_name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                goal.goal_id,
                                "goal_name",
                                e.target.value
                              )
                            }
                            placeholder="ex. Buy a Tesla"
                            disabled={editableGoalId !== goal.goal_id}
                            style={{ fontSize: ".8rem" }}
                            required
                          />
                          {goalErrors[index]?.goal_name && (
                            <div className="text-danger">
                              {goalErrors[index].goal_name}
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
                              className="form-select w-100 p-2 px-2 border border-secondary-subtle rounded"
                              value={goal.goal_type_id || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  goal.goal_id,
                                  "goal_type_id",
                                  Number(e.target.value)
                                )
                              }
                              disabled={editableGoalId !== goal.goal_id}
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
                    <div className="col-md-6 mb-0">
                      <Field label="Target date" className="col">
                        <>
                          <Input
                            type="date"
                            value={goal.target_date || ""}
                            onChange={(e) =>
                              handleInputChange(
                                goal.goal_id,
                                "target_date",
                                e.target.value
                              )
                            }
                            min={new Date().toISOString().split("T")[0]}
                            disabled={editableGoalId !== goal.goal_id}
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
                    <div className="col-md-6 mb-0">
                      <Field label="Saved amount">
                        <>
                          <>
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
                                    goal.goal_id,
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
                                disabled={editableGoalId !== goal.goal_id}
                                style={{ fontSize: ".8rem" }}
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
                                    goal.goal_id,
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
                                disabled={editableGoalId !== goal.goal_id}
                                style={{ fontSize: ".8rem" }}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {editableGoalId !== goal.goal_id ? (
                <a href="#/" onClick={() => setEditableGoal(goal.goal_id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className="bi bi-pencil-square mr-3 hover"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                    />
                  </svg>
                </a>
              ) : (
                <a
                  href="#/"
                  onClick={
                    isNewGoal == true
                      ? () => saveData(goal)
                      : () => handleSave(goal)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    class="bi bi-floppy mr-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 2H9v3h2z" />
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
                  </svg>
                </a>
              )}
              {goal.deletable === 1 || index > 0 ? (
                <a href="#/" onClick={() => deleteGoal(goal.goal_id)}>
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
        ))}
      </div>
    </div>
  );
};
