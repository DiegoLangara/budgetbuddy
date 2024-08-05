import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import logo from "../../Assets/Logonn.png";
import "../../css/Budgets.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Progress } from "./Progress"; // Assume similar to Goals.js

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fetch budget items from the backend
async function fetchBudgetItems(user_id, token) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_HOST+`/api/budgets/`,
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

export const Budgets = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [budgets, setBudgets] = useState(
    state.budgets || [{ id: 1, budget_name: "", amount: "", end_date: "" }]
  );
  const [expandedBudgetId, setExpandedBudgetId] = useState(budgets[0]?.id || 1);
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
      setExpandedBudgetId(
        formattedBudgets.length > 0 ? formattedBudgets[0]?.id : 1
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
      if (!budget.budget_name)
        error.budget_name = "Please enter a name for your budget";
      if (!budget.amount)
        error.amount = "Amount is required and must be greater than 0";
      if (!budget.end_date)
        error.end_date = "Date for your budget to end is required";
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
    setExpandedBudgetId(newBudget.id);
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
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBudgets = budgets.filter((budget) => budget.id !== id);
        setBudgets(updatedBudgets);
        setState({ ...state, budgets: updatedBudgets });
        setExpandedBudgetId(
          updatedBudgets.length > 0 ? updatedBudgets[0].id : null
        );
      }
    });
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_HOST+`/api/budgets/`,
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
        navigate("/onboarding/debts");
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

  const toggleBudget = (id) => {
    setExpandedBudgetId(expandedBudgetId === id ? null : id);
  };

  return (
    <div className="budgets-background">
      <Container className="d-flex align-items-center justify-content-center budgets-background-container">
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
            <Progress /> {/* Add if you have similar progress component */}
            <Form onSubmit={saveData} className="my-3 pb-0">
              <div className="container">
                <div className="row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-0">
                      <h3 style={{ fontSize: "2.2rem" }}>Set Your Budgets</h3>
                      <Link
                        to="/onboarding/debts"
                        className="btn btn-outline-secondary"
                      >
                        Skip for now
                      </Link>
                    </div>
                    <p className="mb-3" style={{ fontSize: "1rem" }}>
                      What is the upper limit of consumption?
                    </p>

                    {budgets.map((budget, index) => (
                      <div key={budget.id} className="accordion mb-0">
                        <div className="mt-1">
                          <div
                            className="accordion-header mb-1"
                            onClick={() => toggleBudget(budget.id)}
                            style={{
                              cursor: "pointer",
                              padding: ".3rem 0",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 style={{ margin: ".2rem 0" }}>
                                Budget{" "}
                                {expandedBudgetId !== budget.id &&
                                budget.budget_name
                                  ? " - " + budget.budget_name
                                  : ""}
                              </h5>
                              {budget.deletable === 1 || index > 0 ? (
                                <a
                                  href="#/"
                                  onClick={() => deleteBudget(budget.id)}
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
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          {expandedBudgetId === budget.id && (
                            <div className="accordion-collapse collapse show">
                              <div className="accordion-body pt-2 px-0 container">
                                <div className="form-row">
                                  <div className="col-md-6 mb-0">
                                    <Field label="Budget name" className="mb-0">
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
                                          <span className="input-group-text bg-white">
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
                                              budget.id,
                                              "end_date",
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
                          )}
                        </div>
                      </div>
                    ))}

                    {/* <div className="d-flex justify-content-center">
                      <Link to="#" className="mt-2" onClick={addBudget}>
                        {budgets.length === 0
                          ? "Create a budget"
                          : "Add more budgets"}
                      </Link>
                    </div> */}
                  </div>
                </div>

                <div className="row btn-row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between mt-5 pt-1">
                      <Link
                        to="/onboarding/incomes"
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
