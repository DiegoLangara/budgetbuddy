import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fetch debts from API
async function fetchDebts(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/${user_id}`,
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
    console.error("Failed to fetch debts:", error);
    return [];
  }
}

const debtCategoryOptions = [
  { id: 0, name: "Select a category", disabled: true },
  { id: 1, name: "Mortgages" },
  { id: 2, name: "Car loans" },
  { id: 3, name: "Personal loans" },
  { id: 4, name: "Credit card" },
  { id: 5, name: "Others" },
];

const debtPeriodOptions = [
  { id: 0, name: "Select a period", disabled: true },
  { id: 1, name: "Weekly" },
  { id: 2, name: "Monthly" },
  { id: 3, name: "Yearly" },
  { id: 4, name: "One-time" },
];

export const Debts = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [debts, setDebts] = useState(
    state.debts || [{ id: 1, debtCategoryId: 0 }]
  );
  const [expandedDebtId, setExpandedDebtId] = useState(debts[0]?.id || 1);

  useEffect(() => {
    async function loadDebts() {
      const fetchedDebts = await fetchDebts(user_id, token);
      const formattedDebts = fetchedDebts.map((debt, index) => ({
        id: debt.debt_id || index + 1,
        debtCategoryId: debt.debt_category_id ?? 0,
        debtAmount: debt.debt_amount || "",
        debtPeriodId: debt.debt_period_id ?? 0,
        dueDate: debt.due_date ? formatDate(debt.due_date) : "",
      }));
      setDebts(
        formattedDebts.length > 0
          ? formattedDebts
          : [{ id: 1, debtCategoryId: 0 }]
      );
      setExpandedDebtId(formattedDebts.length > 0 ? formattedDebts[0]?.id : 1);
      setState({ ...state, debts: formattedDebts });
    }
    loadDebts();
  }, [user_id, token, setState]);

  const handleInputChange = (id, field, value) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, [field]: value } : debt
      )
    );
  };

  const addDebt = () => {
    const newDebt = { id: debts.length + 1, debtCategoryId: 0 };
    setDebts([...debts, newDebt]);
    setExpandedDebtId(newDebt.id);
  };

  const deleteDebt = (id) => {
    const confirmMessage = window.confirm("Are you sure to delete this debt?");
    if (confirmMessage) {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      setState({ ...state, debts: updatedDebts });
      setExpandedDebtId(updatedDebts.length > 0 ? updatedDebts[0].id : null);
    }
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ debts: data.debts }),
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
      debts: debts,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/onboarding/test-dashboard");
  };

  const toggleDebt = (id) => {
    setExpandedDebtId(expandedDebtId === id ? null : id);
  };

  return (
    <Form onSubmit={saveData}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <h3>Set Your Debts</h3>
              <Link
                to="/onboarding/test-dashboard"
                className="btn btn-secondary"
              >
                Skip to next
              </Link>
            </div>

            {debts.map((debt) => (
              <div key={debt.id} className="accordion mb-3">
                <div className="accordion-item border border-secondary-subtle">
                  <div
                    className="accordion-header"
                    onClick={() => toggleDebt(debt.id)}
                    style={{
                      cursor: "pointer",
                      background: "#e7e7e7",
                      padding: "0.5rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Debt {debt.id}</h5>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm ms-3"
                        onClick={() => deleteDebt(debt.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {expandedDebtId === debt.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body p-2">
                        <Field label="Debt category">
                          <select
                            className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                            value={debt.debtCategoryId || 0}
                            onChange={(e) =>
                              handleInputChange(
                                debt.id,
                                "debtCategoryId",
                                Number(e.target.value)
                              )
                            }
                          >
                            {debtCategoryOptions.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                disabled={option.disabled}
                              >
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Debt amount">
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              type="number"
                              value={debt.debtAmount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  debt.id,
                                  "debtAmount",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. 1500"
                              step="100"
                              min="0"
                              className="form-control"
                            />
                          </div>
                        </Field>
                        <Field label="Payment period">
                          <select
                            className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                            value={debt.debtPeriodId || 0}
                            onChange={(e) =>
                              handleInputChange(
                                debt.id,
                                "debtPeriodId",
                                Number(e.target.value)
                              )
                            }
                          >
                            {debtPeriodOptions.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                disabled={option.disabled}
                              >
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Due date">
                          <Input
                            type="date"
                            value={debt.dueDate || ""}
                            onChange={(e) =>
                              handleInputChange(
                                debt.id,
                                "dueDate",
                                e.target.value
                              )
                            }
                            className="form-control"
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-center">
              <Link
                onClick={addDebt}
                className="btn btn-outline-primary mt-3 mb-5"
              >
                {debts.length === 0 ? "Create a debt" : "Add another debt"}
              </Link>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <Link to="/onboarding/budget" className="btn btn-secondary">
                Previous
              </Link>
              <Button type="submit" className="btn btn-primary">
                Save & Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
