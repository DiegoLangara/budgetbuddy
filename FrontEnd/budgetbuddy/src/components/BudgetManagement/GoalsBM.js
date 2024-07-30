import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Input } from "../OnboardingParts/Input";
import "../../css/Goals.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Modal, Form as BootstrapForm } from "react-bootstrap";

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
  const [editableGoalId, setEditableGoalId] = useState(null);
  const [goalErrors, setGoalErrors] = useState([]);
  const [savingGoalId, setSavingGoalId] = useState(null);
  const [addedGoal, setAddedGoal] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_name: "",
    goal_type_id: 0,
    target_amount: 0,
    current_amount: 0,
    target_date: "",
  });

  // Fetch goals on component mount
  useEffect(() => {
    async function loadGoals() {
      const fetchedGoals = await fetchGoals(user_id, token);
      // console.log("Fetched goal data:", fetchGoals); // Debug output
      const formattedGoals = fetchedGoals.map((goal) => ({
        goal_id: goal.goal_id,
        goal_name: goal.goal_name || "",
        goal_type_id: goal.goal_type_id || 0,
        target_amount: goal.target_amount || 0,
        current_amount: goal.current_amount || 0,
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
  }, [user_id, token, setState, addedGoal]);

  const handleInputChange = (goal_id, field, value) => {
    if (editableGoalId !== goal_id) {
      setNewGoal((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
    if (editableGoalId !== goal_id) {
      setNewGoal((prev) => ({
        ...prev,
        [field]: value,
      }));
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
    // console.log(goal);

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

  const handleUpdateData = async (goal) => {
    const validationErrors = validateGoals(goal);
    if (Object.keys(validationErrors).length === 0) {
      setSavingGoalId(goal.goal_id);
      await updateData(goal);
      setEditableGoalId(null);
      setSavingGoalId(null);
    } else {
      setGoalErrors(validationErrors);
    }
  };

  // save new item
  const saveAddedData = async (goal) => {
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

  const handleSaveAddedData = async (goal) => {
    if (!validateGoals()) return;
    console.log(goal);
    // Transform data to the required schema
    const transformedGoal = {
      // goal_id: goal.goal_id,
      goal_name: goal.goal_name || null,
      goal_type_id: goal.goal_type_id,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: formatDate(goal.target_date) || null,
    };
    // setAddedGoal(transformedGoal);
    await saveAddedData(transformedGoal);
    setAddedGoal(transformedGoal);
    handleCloseModal();
  };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 0 0 .4rem",
        width: "100%",
      }}
    >
      <div className="d-flex justify-content-between mt-0 mb-3">
        <div>
          <h4 style={{ fontSize: "2.1rem" }}>Set Your Goals</h4>
          <p className="mb-1" style={{ fontSize: ".95rem" }}>
            What would you like to achieve?
          </p>
        </div>
        <div className="d-flex align-items-end ml-3 pb-2">
          <Link
            to="#"
            className="btn rounded-pill"
            onClick={handleShowModal}
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
            <div className="card-bm-inner">
              <div key={goal.goal_id}>
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
                          margin: goal.goal_name
                            ? ".2rem 0"
                            : "1.75rem 0 .2rem",
                        }}
                        className="goal-title"
                      >
                        <span style={{ fontSize: "1.3rem" }}>
                          <strong>
                            {goal.goal_name ? goal.goal_name : ""}
                          </strong>
                        </span>
                      </h5>
                      <div></div>
                    </div>
                  </div>
                  <div
                    className={`card-content-bm mb-0 ${
                      editableGoalId === goal.goal_id
                        ? "editable"
                        : "non-editable"
                    }`}
                  >
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
                                  placeholder="ex. 1000"
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
            </div>
            <div className="d-flex justify-content-end">
              {editableGoalId !== goal.goal_id ? (
                <a href="#/" onClick={() => setEditableGoal(goal.goal_id)}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              ) : (
                <a href="#/" onClick={() => handleUpdateData(goal)}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17 21V13H7V21"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 3V8H15"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              )}
              <a
                href="#/"
                onClick={() => deleteGoal(goal.goal_id)}
                className="ml-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H21"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>Add New Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="goalName">
              <BootstrapForm.Label className="mt-2">
                Your goal
              </BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="goal_name"
                value={newGoal.goal_name}
                onChange={(e) =>
                  handleInputChange(
                    newGoal.goal_id,
                    "goal_name",
                    e.target.value
                  )
                }
                placeholder="ex. Buy a Tesla"
                style={{ fontSize: "1rem" }}
                required
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="goalCategory">
              <BootstrapForm.Label>Goal category</BootstrapForm.Label>
              <select
                className="form-select w-100 py-3 px-2 border border-secondary-subtle rounded"
                name="goal_type_id"
                value={newGoal.goal_type_id}
                onChange={(e) =>
                  handleInputChange(
                    newGoal.goal_id,
                    "goal_type_id",
                    Number(e.target.value)
                  )
                }
                style={{ fontSize: "1rem" }}
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
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="targetDate">
              <BootstrapForm.Label>Target date</BootstrapForm.Label>
              <BootstrapForm.Control
                type="date"
                name="target_date"
                value={newGoal.target_date}
                onChange={(e) =>
                  handleInputChange(
                    newGoal.goal_id,
                    "target_date",
                    e.target.value
                  )
                }
                min={new Date().toISOString().split("T")[0]}
                style={{ fontSize: "1rem" }}
                required
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="currentAmount">
              <BootstrapForm.Label>Saved amount</BootstrapForm.Label>
              <div className="input-group">
                <span
                  className="input-group-text bg-white"
                  style={{ fontSize: "1rem" }}
                >
                  $
                </span>
                <input
                  type="number"
                  name="current_amount"
                  value={newGoal.current_amount}
                  onChange={(e) =>
                    handleNumberInputChange(
                      newGoal.goal_id,
                      "current_amount",
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="ex. 1000"
                  className="form-control"
                  step="100"
                  min="100"
                  style={{ fontSize: "1rem" }}
                  required
                />
              </div>
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="targetAmount">
              <BootstrapForm.Label>Target amount</BootstrapForm.Label>
              <div className="input-group">
                <span
                  className="input-group-text bg-white"
                  style={{ fontSize: "1rem" }}
                >
                  $
                </span>
                <input
                  type="number"
                  name="target_amount"
                  value={newGoal.target_amount}
                  onChange={(e) =>
                    handleNumberInputChange(
                      newGoal.goal_id,
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
                  style={{ fontSize: "1rem" }}
                  required
                />
              </div>
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <a href="#/" onClick={() => handleSaveAddedData(newGoal)}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 21V13H7V21"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 3V8H15"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <a href="#/" onClick={handleCloseModal} className="mx-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
