import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
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
    console.log("Fetched data:", data); // Debugging log
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
    state.budgets || [{ id: 1, budget_name: "", amount: "", end_date: "" }]
  );
  const [editableBudgetId, setEditableBudgetId] = useState(null);
  const [budgetErrors, setBudgetErrors] = useState([]);

  useEffect(() => {
    async function loadBudgetItems() {
      const fetchedBudgets = await fetchBudgetItems(user_id, token);
      const formattedBudgets = fetchedBudgets.map((budget, index) => ({
        id: budget.budget_id || index + 1,
        budget_name: budget.budget_name || "",
        amount: budget.amount || "",
        deletable: budget.deletable || "",
        end_date: budget.end_date ? formatDate(budget.end_date) : "",
      }));
      // Sort budgets by id in ascending order
      formattedBudgets.sort((a, b) => a.id - b.id);

      setBudgets(
        formattedBudgets.length > 0
          ? formattedBudgets
          : [{ id: 1, budget_name: "", amount: "", end_date: "" }]
      );
      setState({ ...state, budgets: formattedBudgets });
    }
    loadBudgetItems();
  }, [user_id, token, setState]);

  const handleInputChange = (id, field, value) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === id ? { ...budget, [field]: value } : budget
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
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === id
          ? { ...budget, [field]: value, [errorField]: errorMessage }
          : budget
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
      budgets.length > 0 ? Math.max(...budgets.map((g) => g.id)) + 1 : 1;
    const newBudget = {
      id: newId,
      budget_name: "",
      amount: "",
      end_date: "",
    };
    const updatedBudgets = [...budgets, newBudget];
    updatedBudgets.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setBudgets(updatedBudgets);
  };

  const setEditableBudget = (id) => {
    setEditableBudgetId(id);
  };

  const deleteBudgetFromDatabase = async (user_id, token, id) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budget/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            budget_id: id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete budget from the database");
      }
      console.log(
        `Budget with ID ${id} deleted successfully from the database`
      );
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw error;
    }
  };

  const deleteBudget = (id) => {
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
          await deleteBudgetFromDatabase(user_id, token, id); // Delete from database first
          const updatedBudgets = budgets.filter((budget) => budget.id !== id);
          setBudgets(updatedBudgets);
          setState({ ...state, budgets: updatedBudgets });
          if (editableBudgetId === id) {
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

  const saveToDatabase = async (data) => {
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
          body: JSON.stringify({ budgets: data.budgets }),
        }
      );
      console.log(JSON.stringify({ budgets: data.budgets }));
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

  const saveData = async (event) => {
    event.preventDefault();
    if (!validateBudgets()) return;
    // Transform data to the required schema
    const transformedBudgets = budgets.map((budget) => ({
      budget_id: budget.id,
      budget_name: budget.budget_name || null,
      amount: budget.amount,
      end_date: budget.end_date || null,
    }));
    const combinedData = {
      ...state,
      budgets: transformedBudgets,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
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
            <h3 style={{ fontSize: "2.1rem" }}>Set Your Budgets</h3>
            <p className="mb-1" style={{ fontSize: ".95rem" }}>
              What is the upper limit of consumption?
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
              {budgets.length === 0
                ? "+ Create a Budget"
                : "+ Add More Budgets"}
            </Link>
          </div>
        </div>
        <Container className="mx-0 px-0">
          <div className="d-flex px-0 row">
            {budgets.map((budget, index) => (
              <Card
                key={index}
                className={`p-3 m-2 col card-bm ${
                  editableBudgetId === budget.id ? "editable" : null
                }`}
                style={{ minHeight: "auto", maxWidth: "50%" }}
              >
                <div
                  key={budget.id}
                  className={`mb-0 ${
                    editableBudgetId === budget.id ? "editable" : "non-editable"
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
                          <strong>Budget {index + 1}</strong>{" "}
                          <span style={{ fontSize: "1rem" }}>
                            {budget.budget_name
                              ? " - " + budget.budget_name
                              : ""}
                          </span>
                        </h5>
                        <div></div>
                      </div>
                    </div>
                    <div>
                      <div className="form-row">
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Budget Name" className="mb-0">
                            <>
                              <Input
                                type="text"
                                value={budget.budget_name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    budget.id,
                                    "budget_name",
                                    e.target.value
                                  )
                                }
                                placeholder="ex. Groceries"
                                disabled={editableBudgetId !== budget.id}
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
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Budget amount" className="mb-0">
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
                                      budget.id,
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
                                  disabled={editableBudgetId !== budget.id}
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
                        <div className="col-md-6 form-group mb-0">
                          <Field label="End date" className="col">
                            <>
                              <Input
                                type="date"
                                value={budget.end_date || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    budget.id,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                                min={new Date().toISOString().split("T")[0]}
                                disabled={editableBudgetId !== budget.id}
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
                  <button
                    className="btn btn-secondary btn-sm px-3 mr-2 mt-1"
                    type="button"
                    onClick={() => setEditableBudget(budget.id)}
                  >
                    Edit
                  </button>
                  {budget.deletable === 1 || index > 0 ? (
                    <button
                      className="btn btn-danger btn-sm mt-1"
                      type="button"
                      onClick={() => deleteBudget(budget.id)}
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
