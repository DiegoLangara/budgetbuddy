import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Input } from "../OnboardingParts/Input";
import "../../css/Budgets.css";
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

// Fetch budget items from the backend
async function fetchBudgetItems(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budgets/`,
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
    // console.log("Fetched data:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch budget items:", error);
    return [];
  }
}

export const BudgetsBM = () => {
  const [state, setState] = useOnboardingState();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [budgets, setBudgets] = useState(
    state.budgets || [
      { budget_id: 1, budget_name: "", amount: "", end_date: "" },
    ]
  );
  const [editableBudgetId, setEditableBudgetId] = useState(null);
  const [budgetErrors, setBudgetErrors] = useState([]);
  const [savingBudgetId, setSavingBudgetId] = useState(null);
  const [isNewBudget, setIsNewBudget] = useState(false);
  const [addedBudget, setAddedBudget] = useState([]);

  useEffect(() => {
    async function loadBudgetItems() {
      const fetchedBudgets = await fetchBudgetItems(user_id, token);
      const formattedBudgets = fetchedBudgets.map((budget, index) => ({
        budget_id: budget.budget_id || index + 1,
        budget_name: budget.budget_name || "",
        amount: budget.amount || "",
        deletable: budget.deletable || "",
        end_date: budget.end_date ? formatDate(budget.end_date) : "",
      }));
      // Sort budgets by id in ascending order
      formattedBudgets.sort((a, b) => a.budget_id - b.budget_id);

      setBudgets(
        formattedBudgets.length > 0
          ? formattedBudgets
          : [{ budget_id: 1, budget_name: "", amount: "", end_date: "" }]
      );
      setState({ ...state, budgets: formattedBudgets });
      setBudgetErrors([]);
    }
    loadBudgetItems();
  }, [user_id, token, setState]);

  const handleInputChange = (budget_id, field, value) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.budget_id === budget_id ? { ...budget, [field]: value } : budget
      )
    );
  };

  const handleNumberInputChange = (budget_id, field, value) => {
    let errorMessage;

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.budget_id === budget_id ? { ...budget, [field]: value } : budget
      )
    );
  };

  const validateBudgets = () => {
    const errors = budgets.map((budget) => {
      const error = {};
      if (!budget.budget_name) error.budget_name = "Input required";
      if (!budget.amount) error.amount = "Input required";
      if (!budget.end_date) error.end_date = "Input required";
      return error;
    });
    setBudgetErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const addBudget = () => {
    const newId =
      budgets.length > 0 ? Math.max(...budgets.map((g) => g.budget_id)) + 1 : 1;
    const newBudget = {
      budget_id: newId,
      budget_name: "",
      amount: "",
      end_date: "",
    };
    const updatedBudgets = [...budgets, newBudget];
    updatedBudgets.sort((a, b) => a.budget_id - b.budget_id); // Ensure order is maintained
    setBudgets(updatedBudgets);
    setIsNewBudget(true);
  };

  const setEditableBudget = (budget_id) => {
    setEditableBudgetId(budget_id);
  };

  const deleteBudgetFromDatabase = async (user_id, token, budget_id) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budget/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            budget_id: budget_id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete budget from the database");
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw error;
    }
  };

  const deleteBudget = (budget_id) => {
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
          await deleteBudgetFromDatabase(user_id, token, budget_id); // Delete from database first
          const updatedBudgets = budgets.filter(
            (budget) => budget.budget_id !== budget_id
          );
          setBudgets(updatedBudgets);
          setState({ ...state, budgets: updatedBudgets });
          if (editableBudgetId === budget_id) {
            setEditableBudgetId(null);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Failed to delete budget from the database",
            "error"
          );
        }
      }
    });
  };

  // save(update) existing item
  const updateData = async (budget) => {
    // Create a copy of the budget object without the error fields

    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budget/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            budget_id: budget.budget_id,
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(budget),
        }
      );
      // console.log(JSON.stringify(budget));
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

  const handleSave = async (budget) => {
    const validationErrors = validateBudgets(budget);
    if (Object.keys(validationErrors).length === 0) {
      setSavingBudgetId(budget.budget_id);
      await updateData(budget);
      setEditableBudgetId(null);
      setSavingBudgetId(null);
      setIsNewBudget(false);
    } else {
      setBudgetErrors(validationErrors);
    }
  };

  // save new item
  const saveToDatabase = async (budget) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budgets/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(budget),
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

  const saveData = async (budget) => {
    if (!validateBudgets()) return;
    // Transform data to the required schema
    const transformedBudget = {
      budget_id: budget.budget_id,
      budget_name: budget.budget_name || null,
      amount: budget.amount,
      end_date: budget.end_date || null,
    };
    setAddedBudget(transformedBudget);
    await saveToDatabase(addedBudget);
    setIsNewBudget(false);
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
          <h3 style={{ fontSize: "2.1rem" }}>Set Your Budgets</h3>
          <p className="mb-1" style={{ fontSize: ".95rem" }}>
            How much is your expense limit?
          </p>
        </div>
        <div className="d-flex align-items-end ml-3 pb-2">
          <Link
            to="#"
            className="btn rounded-pill"
            onClick={addBudget}
            style={{
              fontSize: ".9rem",
              fontWeight: "bold",
              color: "Black",
              backgroundColor: "#eee",
              border: "1px solid gray",
              padding: ".6rem",
            }}
          >
            {budgets.length === 0 ? "+ Create a Budget" : "+ Add More Budgets"}
          </Link>
        </div>
      </div>
      <div className="container-bm">
        {budgets.map((budget, index) => (
          <div
            key={index}
            className={`p-3 m-0 card-bm ${
              editableBudgetId === budget.budget_id ? "editable" : null
            }`}
            style={{ minHeight: "auto" }}
          >
            <div
              key={budget.budget_id}
              className={`mb-0 ${
                editableBudgetId === budget.budget_id
                  ? "editable"
                  : "non-editable"
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
                        margin: budget.budget_name
                          ? ".2rem 0"
                          : "1.75rem 0 .2rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>
                        <strong>
                          {budget.budget_name ? budget.budget_name : ""}
                        </strong>
                      </span>
                    </h5>
                    <div></div>
                  </div>
                </div>
                <div>
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="Budget Name" className="mb-0">
                        <>
                          <Input
                            type="text"
                            value={budget.budget_name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                budget.budget_id,
                                "budget_name",
                                e.target.value
                              )
                            }
                            placeholder="ex. Groceries"
                            disabled={editableBudgetId !== budget.budget_id}
                            style={{ fontSize: ".8rem" }}
                            required
                          />
                          {budgetErrors[index]?.budget_name && (
                            <div className="text-danger">
                              {budgetErrors[index]?.budget_name}
                            </div>
                          )}
                        </>
                      </Field>
                    </div>
                    <div className="col-md-6 mb-0">
                      <Field label="Budget amount">
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
                              value={budget.amount || ""}
                              onChange={(e) =>
                                handleNumberInputChange(
                                  budget.budget_id,
                                  "amount",
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "e") {
                                  e.preventDefault();
                                }
                              }}
                              placeholder="e.g. 1200"
                              className="form-control"
                              step="100"
                              min="0"
                              disabled={editableBudgetId !== budget.budget_id}
                              style={{ fontSize: ".8rem" }}
                              required
                            />
                          </div>
                          {budget.amount_error && (
                            <div className="text-danger">
                              {budget.amount_error}
                            </div>
                          )}
                          {budgetErrors[index]?.amount && (
                            <div className="text-danger">
                              {budgetErrors[index]?.amount}
                            </div>
                          )}
                        </>
                      </Field>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="End date" className="col">
                        <>
                          <Input
                            type="date"
                            value={budget.end_date || ""}
                            onChange={(e) =>
                              handleInputChange(
                                budget.budget_id,
                                "end_date",
                                e.target.value
                              )
                            }
                            min={new Date().toISOString().split("T")[0]}
                            disabled={editableBudgetId !== budget.budget_id}
                            style={{ fontSize: ".8rem" }}
                            required
                          />
                          {budgetErrors[index]?.end_date && (
                            <div className="text-danger">
                              {budgetErrors[index]?.end_date}
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
              {editableBudgetId !== budget.budget_id ? (
                <a
                  href="#/"
                  onClick={() => setEditableBudget(budget.budget_id)}
                >
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
                    isNewBudget == true
                      ? () => saveData(budget)
                      : () => handleSave(budget)
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
              {budget.deletable === 1 || index > 0 ? (
                <a href="#/" onClick={() => deleteBudget(budget.budget_id)}>
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
