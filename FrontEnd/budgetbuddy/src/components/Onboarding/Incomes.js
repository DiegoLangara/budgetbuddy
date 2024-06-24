import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

// Fetch incomes from the backend
async function fetchIncomes(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  { id: 1, name: "Salary" },
  { id: 2, name: "Wages" },
  { id: 3, name: "Tips" },
  { id: 4, name: "Investments" },
  { id: 5, name: "Rental properties" },
  { id: 6, name: "Others" },
];

// Income period options
const incomePeriodOptions = [
  { id: 0, name: "Select period", disabled: true },
  { id: 1, name: "Weekly" },
  { id: 2, name: "Monthly" },
  { id: 3, name: "Yearly" },
  { id: 4, name: "One-time" },
];

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

  useEffect(() => {
    async function loadIncomes() {
      const fetchedIncomes = await fetchIncomes(user_id, token);
      const formattedIncomes = fetchedIncomes.map((income, index) => ({
        id: income.income_id || index + 1,
        income_type_id: income.income_type_id ?? 0,
        amount: income.amount || "",
        period: income.period ?? 0,
      }));
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

  const addIncome = () => {
    const newIncome = { id: incomes.length + 1, income_type_id: 0 };
    setIncomes([...incomes, newIncome]);
    setExpandedIncomeId(newIncome.id);
  };

  const deleteIncome = (id) => {
    const confirmMessage = window.confirm("Are you sure to delete this item?");
    if (confirmMessage) {
      const updatedIncomes = incomes.filter((income) => income.id !== id);
      setIncomes(updatedIncomes);
      setState({ ...state, incomes: updatedIncomes });
      setExpandedIncomeId(
        updatedIncomes.length > 0 ? updatedIncomes[0].id : null
      );
    }
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ incomes: data.incomes }),
        }
      );
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
      incomes: incomes,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/onboarding/budget");
  };

  const toggleIncome = (id) => {
    setExpandedIncomeId(expandedIncomeId === id ? null : id);
  };

  return (
    <Form onSubmit={saveData}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <h3>Set Your Incomes</h3>
              <Link to="/onboarding/budget" className="btn btn-secondary">
                Skip to next
              </Link>
            </div>

            {incomes.map((income) => (
              <div key={income.id} className="accordion mb-3">
                <div className="accordion-item border border-secondary-sutble">
                  <div
                    className="accordion-header"
                    onClick={() => toggleIncome(income.id)}
                    style={{
                      cursor: "pointer",
                      background: "#e7e7e7",
                      padding: "0.5rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Income {income.id}</h5>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        type="button"
                        onClick={() => deleteIncome(income.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {expandedIncomeId === income.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body p-2">
                        <Field label="Income category">
                          <div>
                            <select
                              className="form-select w-100 p-2 border border-secondary-subtle round round-2"
                              value={income.income_type_id || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  income.id,
                                  "income_type_id",
                                  Number(e.target.value)
                                )
                              }
                            >
                              {incomeCategoryOptions.map((option) => (
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
                        <Field label="Income amount">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              type="number"
                              value={income.amount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  income.id,
                                  "amount",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. 2500"
                              step="100"
                              min="0"
                              className="form-control"
                            />
                          </div>
                        </Field>
                        <Field label="How often do you earn it?">
                          <div>
                            <select
                              className="form-select w-100 p-2 border border-secondary-subtle round round-2"
                              value={income.period || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  income.id,
                                  "period",
                                  Number(e.target.value)
                                )
                              }
                            >
                              {incomePeriodOptions.map((option) => (
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
                  )}
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-center">
              <Link
                to="#"
                className="btn btn-outline-primary mt-3 mb-5 "
                onClick={addIncome}
              >
                {incomes.length === 0
                  ? "Create an income"
                  : "Add another income"}
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/onboarding/goals"
                className="btn btn-outline-secondary"
              >
                {"<"} Return
              </Link>
              <Button type="submit" className="btn btn-primary">
                Save & Next {">"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
