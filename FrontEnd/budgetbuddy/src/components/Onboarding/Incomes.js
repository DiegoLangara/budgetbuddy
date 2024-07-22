import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import logo from "../../Assets/Logonn.png";
import "../../css/Incomes.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Progress } from "./Progress";

// Fetch incomes from the backend
async function fetchIncomes(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/`,
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
    console.error("Failed to fetch incomes:", error);
    return [];
  }
}

// Income categories options
const incomeCategoryOptions = [
  { id: 0, name: "Select category", disabled: true },
  { id: 1, name: "Salary/Wages" },
  { id: 2, name: "Bonuses" },
  { id: 3, name: "Freelance Income" },
  { id: 4, name: "Business Income" },
  { id: 5, name: "Investment Income" },
  { id: 6, name: "Rental Income" },
  { id: 7, name: "Pension" },
  { id: 8, name: "Social Security" },
  { id: 9, name: "Child Support" },
  { id: 10, name: "Others" },
];

// Income period options
const incomePeriodOptions = [
  { id: 0, name: "Select period", disabled: true },
  { id: 1, name: "one-off" },
  { id: 2, name: "daily" },
  { id: 3, name: "weekly" },
  { id: 4, name: "bi-weekly" },
  { id: 5, name: "monthly" },
  { id: 6, name: "quarterly" },
  { id: 7, name: "annually" },
];

// Map period IDs to names
const periodIdToName = {
  1: "one-off",
  2: "daily",
  3: "weekly",
  4: "bi-weekly",
  5: "monthly",
  6: "quarterly",
  7: "annually",
};

// Map period names to IDs
const periodNameToId = {
  "one-off": 1,
  daily: 2,
  weekly: 3,
  "bi-weekly": 4,
  monthly: 5,
  quarterly: 6,
  annually: 7,
};

export const Incomes = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [incomes, setIncomes] = useState(
    state.incomes || [{ id: 1, income_type_id: 0 }]
  );
  const [expandedIncomeId, setExpandedIncomeId] = useState(incomes[0]?.id || 1);
  const [incomeErrors, setIncomeErrors] = useState([]);

  useEffect(() => {
    async function loadIncomes() {
      const fetchedIncomes = await fetchIncomes(user_id, token);
      const formattedIncomes = fetchedIncomes.map((income, index) => ({
        id: income.income_id || index + 1,
        income_name: income.income_name || "",
        income_type_id: income.income_type_id ?? 0,
        amount: income.amount || "",
        period: periodNameToId[income.period] ?? 0,
        deletable: income.deletable || "",
      }));
      // Sort incomes by id in ascending order
      formattedIncomes.sort((a, b) => a.id - b.id);

      setIncomes(
        formattedIncomes.length > 0
          ? formattedIncomes
          : [{ id: 1, income_type_id: 0 }]
      );
      setExpandedIncomeId(
        formattedIncomes.length > 0 ? formattedIncomes[0]?.id : 1
      );
      setState({ ...state, incomes: formattedIncomes });
    }
    loadIncomes();
  }, [user_id, token, setState]);

  const handleInputChange = (id, field, value) => {
    setIncomes((prevIncomes) =>
      prevIncomes.map((income) =>
        income.id === id ? { ...income, [field]: value } : income
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
    setIncomes((prevIncomes) =>
      prevIncomes.map((income) =>
        income.id === id
          ? { ...income, [field]: value, [errorField]: errorMessage }
          : income
      )
    );
  };

  const validateIncomes = () => {
    const errors = incomes.map((income) => {
      const error = {};
      if (!income.income_name) error.income_name = "Input required";
      if (income.income_type_id === 0) error.income_type_id = "Input required";
      if (!income.amount) error.amount = "Input required";
      if (!income.period) error.period = "Input required";
      return error;
    });
    setIncomeErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const addIncome = () => {
    const newId =
      incomes.length > 0 ? Math.max(...incomes.map((g) => g.id)) + 1 : 1;
    const newIncome = { id: newId, income_type_id: 0 };
    const updatedIncomes = [...incomes, newIncome];
    updatedIncomes.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setIncomes(updatedIncomes);
    setExpandedIncomeId(newIncome.id);
  };

  const deleteIncome = (id) => {
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
        const updatedIncomes = incomes.filter((income) => income.id !== id);
        setIncomes(updatedIncomes);
        setState({ ...state, incomes: updatedIncomes });
        setExpandedIncomeId(
          updatedIncomes.length > 0 ? updatedIncomes[0].id : null
        );
      }
    });
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify({ incomes: data.incomes }),
        }
      );
      console.log(JSON.stringify({ incomes: data.incomes }));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);

      if (responseData.success) {
        navigate("/onboarding/budgets");
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
    if (!validateIncomes()) return;
    // Transform data to the required schema
    const transformedIncomes = incomes.map((income) => ({
      income_id: income.id,
      income_name: income.income_name || null,
      income_type_id: income.income_type_id,
      amount: income.amount,
      period: periodIdToName[income.period],
      income_type_name:
        incomeCategoryOptions.find(
          (category) => category.id === income.income_type_id
        )?.name || "",
    }));

    const combinedData = {
      ...state,
      incomes: transformedIncomes,
    };

    setState(combinedData);
    await saveToDatabase(combinedData);
  };

  const toggleIncome = (id) => {
    setExpandedIncomeId(expandedIncomeId === id ? null : id);
  };

  return (
    <div className="incomes-background">
      <Container className="d-flex align-items-center justify-content-center incomes-background-container">
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
                      <h3 style={{ fontSize: "2.2rem" }}>Set Your Incomes</h3>
                      <Link
                        to="/onboarding/budgets"
                        className="btn btn-outline-secondary"
                      >
                        Skip for now
                      </Link>
                    </div>
                    <p className="mb-3" style={{ fontSize: "1rem" }}>
                      How much do you earn?
                    </p>

                    {incomes.map((income, index) => (
                      <div key={income.id} className="accordion mb-0">
                        <div className="mt-1">
                          <div
                            className="accordion-header mb-1"
                            onClick={() => toggleIncome(income.id)}
                            style={{
                              cursor: "pointer",
                              padding: ".3rem 0",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 style={{ margin: ".2rem 0" }}>
                                Income {index + 1}{" "}
                                {expandedIncomeId !== income.id &&
                                income.income_name
                                  ? " - " + income.income_name
                                  : ""}
                              </h5>
                              {income.deletable === 1 || index > 0 ? (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  type="button"
                                  onClick={() => deleteIncome(income.id)}
                                >
                                  Delete
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          {expandedIncomeId === income.id && (
                            <div className="accordion-collapse collapse show">
                              <div className="accordion-body pt-2 px-0 container">
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Income name" className="mb-0">
                                      <>
                                        <Input
                                          type="text"
                                          value={income.income_name || ""}
                                          onChange={(e) =>
                                            handleInputChange(
                                              income.id,
                                              "income_name",
                                              e.target.value
                                            )
                                          }
                                          placeholder="ex. House rental"
                                        />
                                        {incomeErrors[index]?.income_name && (
                                          <div className="text-danger">
                                            {incomeErrors[index]?.income_name}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Income category">
                                      <>
                                        <div className="mt-0">
                                          <select
                                            className="form-select w-100 p-2 border border-secondary-subtle rounded"
                                            value={income.income_type_id || 0}
                                            onChange={(e) =>
                                              handleInputChange(
                                                income.id,
                                                "income_type_id",
                                                Number(e.target.value)
                                              )
                                            }
                                            required
                                          >
                                            {incomeCategoryOptions.map(
                                              (option) => (
                                                <option
                                                  key={option.id}
                                                  value={option.id}
                                                  disabled={option.disabled}
                                                >
                                                  {option.name}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </div>
                                        {incomeErrors[index]
                                          ?.income_type_id && (
                                          <div className="text-danger">
                                            {
                                              incomeErrors[index]
                                                ?.income_type_id
                                            }
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field
                                      label="Income amount"
                                      className="col"
                                    >
                                      <>
                                        <>
                                          <div className="input-group">
                                            <span className="input-group-text bg-white">
                                              $
                                            </span>
                                            <Input
                                              type="number"
                                              value={income.amount || ""}
                                              onChange={(e) =>
                                                handleNumberInputChange(
                                                  income.id,
                                                  "amount",
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "e") {
                                                  e.preventDefault();
                                                }
                                              }}
                                              placeholder="ex. 2500"
                                              className="form-control"
                                              step="100"
                                              min="0"
                                              required
                                            />
                                          </div>
                                          {income.amount_error && (
                                            <div className="text-danger">
                                              {income.amount_error}
                                            </div>
                                          )}
                                        </>
                                        {incomeErrors[index]?.amount && (
                                          <div className="text-danger">
                                            {incomeErrors[index]?.amount}
                                          </div>
                                        )}
                                      </>
                                    </Field>
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Income period">
                                      <>
                                        <div className="mt-0">
                                          <select
                                            className="form-select w-100 p-2 border border-secondary-subtle rounded"
                                            value={income.period || ""}
                                            onChange={(e) =>
                                              handleInputChange(
                                                income.id,
                                                "period",
                                                e.target.value
                                              )
                                            }
                                            required
                                          >
                                            {incomePeriodOptions.map(
                                              (option) => (
                                                <option
                                                  key={option.id}
                                                  value={option.id}
                                                  disabled={option.disabled}
                                                >
                                                  {option.name}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </div>
                                        {incomeErrors[index]?.period && (
                                          <div className="text-danger">
                                            {incomeErrors[index]?.period}
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

                    <div className="d-flex justify-content-center">
                      <Link to="#" className="mt-2" onClick={addIncome}>
                        {incomes.length === 0
                          ? "Create an income"
                          : "Add more incomes"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="row btn-row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between mt-5 pt-1">
                      <Link
                        to="/onboarding/goals"
                        className="btn btn-outline-secondary w-50"
                      >
                        Go back
                      </Link>
                      <BootstrapButton
                        type="submit"
                        className="btn btn-primary w-50 ml-3"
                      >
                        Continue
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
