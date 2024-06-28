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
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/`,
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
    state.debts || [{ id: 1, debt_type_id: 0 }]
  );
  const [expandedDebtId, setExpandedDebtId] = useState(debts[0]?.id || 1);

  useEffect(() => {
    async function loadDebts() {
      const fetchedDebts = await fetchDebts(user_id, token);
      const formattedDebts = fetchedDebts.map((debt, index) => ({
        id: debt.debt_id || index + 1,
        debt_type_id: debt.debt_type_id ?? 0,
        amount: debt.amount || "",
        period: debt.period ?? 0,
        deletable: debt.deletable || "",
        due_date: debt.due_date ? formatDate(debt.due_date) : "",
      }));
      // Sort incomes by id in ascending order
      formattedDebts.sort((a, b) => a.id - b.id);

      setDebts(
        formattedDebts.length > 0
          ? formattedDebts
          : [{ id: 1, debt_type_id: 0 }]
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
    const newId =
      debts.length > 0 ? Math.max(...debts.map((g) => g.id)) + 1 : 1;
    const newDebt = { id: newId, debt_type_id: 0 };
    const updatedDebts = [...debts, newDebt];
    updatedDebts.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setDebts(updatedDebts);
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
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify({ debts: data.debts }),
        }
      );
      console.log(JSON.stringify({ debts: data.debts }));
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
    navigate("/onboarding/complete-process");
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
                to="/onboarding/complete-process"
                className="btn btn-secondary"
              >
                Skip to next
              </Link>
            </div>

            {debts.map((debt, index) => (
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
                      <h5 style={{ margin: ".2rem 0" }}>
                        Debt {index + 1}{" "}
                        {debt.amount ? " - " + debt.amount : ""}
                      </h5>
                      {debt.deletable === 1 ? (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDebt(debt.id);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {expandedDebtId === debt.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body p-3 container">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <Field label="Debt Category">
                              <select
                                className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                                value={debt.debt_type_id || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    debt.id,
                                    "debt_type_id",
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
                          </div>
                          <div className="col-md-6">
                            <Field label="Debt Amount">
                              <div className="input-group">
                                <span className="input-group-text">$</span>
                                <Input
                                  type="number"
                                  value={debt.amount || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      debt.id,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., 1500"
                                  step="100"
                                  min="0"
                                  className="form-control"
                                />
                              </div>
                            </Field>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <Field label="Payment Period">
                              <select
                                className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                                value={debt.period || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    debt.id,
                                    "period",
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
                          </div>
                          <div className="col-md-6">
                            <Field label="Due Date">
                              <Input
                                type="date"
                                value={debt.due_date || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    debt.id,
                                    "due_date",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
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
              <Link
                to="#"
                className="btn btn-outline-primary mt-3 mb-5"
                onClick={addDebt}
              >
                {debts.length === 0 ? "Create a debt" : "Add another debt"}
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/onboarding/budget"
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
