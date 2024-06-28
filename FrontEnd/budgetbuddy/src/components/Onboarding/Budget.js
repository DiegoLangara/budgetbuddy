import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

// Fetch budget items from the backend
async function fetchBudgetItems(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budget/}`,
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
    console.error("Failed to fetch budget items:", error);
    return [];
  }
}

// Budget category options
const budgetCategoryOptions = [
  { id: 0, name: "Select category", disabled: true },
  { id: 1, name: "Rent" },
  { id: 2, name: "Hydro" },
  { id: 3, name: "Internet" },
  { id: 4, name: "Mobile" },
  { id: 5, name: "Groceries" },
  { id: 6, name: "Daily Necessities" },
  { id: 7, name: "Education" },
  { id: 8, name: "Health" },
  { id: 9, name: "Clothing" },
  { id: 10, name: "Hobbies" },
  { id: 11, name: "Savings" },
  { id: 12, name: "Others" },
];

// Budget period options
const budgetPeriodOptions = [
  { id: 0, name: "Select period", disabled: true },
  { id: 1, name: "Weekly" },
  { id: 2, name: "Monthly" },
  { id: 3, name: "Yearly" },
  { id: 4, name: "One-time" },
];

export const Budget = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [expenses, setExpenses] = useState(
    state.expenses || [{ id: 1, expense_type_id: 0 }]
  );
  const [expandedExpenseId, setExpandedExpenseId] = useState(
    expenses[0]?.id || 1
  );

  useEffect(() => {
    async function loadBudgetItems() {
      const fetchedExpenses = await fetchBudgetItems(user_id, token);
      const formattedExpenses = fetchedExpenses.map((expense, index) => ({
        id: expense.budget_id || index + 1,
        expense_type_id: expense.expense_type_id ?? 0,
        amount: expense.amount || "",
        period: expense.period ?? 0,
        deletable: expense.deletable || "",
      }));
      // Sort expenses by id in ascending order
      formattedExpenses.sort((a, b) => a.id - b.id);

      setExpenses(
        formattedExpenses.length > 0
          ? formattedExpenses
          : [{ id: 1, expense_type_id: 0 }]
      );
      setExpandedExpenseId(
        formattedExpenses.length > 0 ? formattedExpenses[0]?.id : 1
      );
      setState({ ...state, expenses: formattedExpenses });
    }
    loadBudgetItems();
  }, [user_id, token, setState]);

  const handleInputChange = (id, field, value) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  const addExpense = () => {
    const newId =
      expenses.length > 0 ? Math.max(...expenses.map((g) => g.id)) + 1 : 1;
    const newExpense = { id: newId, expense_type_id: 0 };
    const updatedExpenses = [...expenses, newExpense];
    updatedExpenses.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setExpenses(updatedExpenses);
    setExpandedExpenseId(newExpense.id);
  };

  const deleteExpense = (id) => {
    const confirmMessage = window.confirm("Are you sure to delete this item?");
    if (confirmMessage) {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(updatedExpenses);
      setState({ ...state, expenses: updatedExpenses });
      setExpandedExpenseId(
        updatedExpenses.length > 0 ? updatedExpenses[0].id : null
      );
    }
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budget/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify({ expenses: data.expenses }),
        }
      );
      console.log(JSON.stringify({ expenses: data.expenses }));
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
      expenses: expenses,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/onboarding/debts");
  };

  const toggleExpense = (id) => {
    setExpandedExpenseId(expandedExpenseId === id ? null : id);
  };

  return (
    <Form onSubmit={saveData}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <h3>Set Your Budget</h3>
              <Link to="/onboarding/debts" className="btn btn-secondary">
                Skip to next
              </Link>
            </div>

            {expenses.map((expense, index) => (
              <div key={expense.id} className="accordion mb-3">
                <div className="accordion-item border border-secondary-subtle">
                  <div
                    className="accordion-header"
                    onClick={() => toggleExpense(expense.id)}
                    style={{
                      cursor: "pointer",
                      background: "#e7e7e7",
                      padding: "0.5rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 style={{ margin: ".2rem 0" }}>
                        Budget {index + 1}{" "}
                        {expense.amount ? " - " + expense.amount : ""}
                      </h5>
                      {expense.deletable === 1 ? (
                        <button
                          type="button"
                          className="btn btn-outline-danger  btn-sm ms-3"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent collapse/expand on delete
                            deleteExpense(expense.id);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {expandedExpenseId === expense.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body p-3 container">
                        <div className="row">
                          <div className="col-md-6">
                            <Field label="Predicted expense category">
                              <select
                                className="form-select w-100 p-2 border border-secondary-subtle rounded-2"
                                value={expense.expense_type_id || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    expense.id,
                                    "expense_type_id",
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {budgetCategoryOptions.map((option) => (
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
                            <Field label="Predicted expense amount">
                              <div className="input-group">
                                <span className="input-group-text">$</span>
                                <Input
                                  type="number"
                                  value={expense.amount || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      expense.id,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. 1200"
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
                            <Field label="How often would you pay for it?">
                              <select
                                className="form-select w-100 p-2 border border-secondary-subtle rounded-2"
                                value={expense.period || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    expense.id,
                                    "period",
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {budgetPeriodOptions.map((option) => (
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
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-center">
              <Link
                onClick={addExpense}
                className="btn btn-outline-primary mt-3 mb-5"
              >
                {expenses.length === 0
                  ? "Create an expense"
                  : "Add another expense"}
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/onboarding/incomes"
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
