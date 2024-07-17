import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import "../../css/Debts.css";
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
    console.log("Fetched data:", data); // Debugging log
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

export const DebtsBM = () => {
  const [state, setState] = useOnboardingState();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [debts, setDebts] = useState(
    state.debts || [{ id: 1, debt_types_id: 0 }]
  );
  const [editableDebtId, setEditableDebtId] = useState(null);
  const [debtErrors, setDebtErrors] = useState([]);

  useEffect(() => {
    async function loadDebts() {
      const fetchedDebts = await fetchDebts(user_id, token);
      const formattedDebts = fetchedDebts.map((debt, index) => ({
        id: debt.debt_id || index + 1,
        debt_name: debt.debt_name || "",
        debt_types_id: debt.debt_types_id ?? 0,
        amount: debt.amount || "",
        due_date: debt.due_date ? formatDate(debt.due_date) : "",
        deletable: debt.deletable || "",
      }));
      // Sort incomes by id in ascending order
      formattedDebts.sort((a, b) => a.id - b.id);

      setDebts(
        formattedDebts.length > 0
          ? formattedDebts
          : [{ id: 1, debt_types_id: 0 }]
      );
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

  const handleNumberInputChange = (id, field, value) => {
    let errorField = field + "_error";
    let errorMessage = "";

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id
          ? { ...debt, [field]: value, [errorField]: errorMessage }
          : debt
      )
    );
  };

  const validateDebts = () => {
    const errors = debts.map((debt) => {
      const error = {};
      if (!debt.debt_name) error.debt_name = "Input required";
      if (!debt.debt_types_id) error.debt_types_id = "Input required";
      if (!debt.amount) error.amount = "Input required";
      if (!debt.due_date) error.due_date = "Input required";
      return error;
    });
    setDebtErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const addDebt = () => {
    const newId =
      debts.length > 0 ? Math.max(...debts.map((g) => g.id)) + 1 : 1;
    const newDebt = { id: newId, debt_types_id: 0 };
    const updatedDebts = [...debts, newDebt];
    updatedDebts.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setDebts(updatedDebts);
  };

  const setEditableDebt = (id) => {
    setEditableDebtId(id);
  };

  const deleteDebtFromDatabase = async (user_id, token, id) => {
    try {
      console.log(user_id, token, id);
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debt/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            debt_id: id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete debt from the database");
      }
      console.log(`Debt with ID ${id} deleted successfully from the database`);
    } catch (error) {
      console.error("Failed to delete debt:", error);
      throw error;
    }
  };

  const deleteDebt = (id) => {
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
          await deleteDebtFromDatabase(user_id, token, id); // Delete from database first
          const updatedDebts = debts.filter((debt) => debt.id !== id);
          setDebts(updatedDebts);
          setState({ ...state, debts: updatedDebts });
          if (editableDebtId === id) {
            setEditableDebtId(null);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Failed to delete debt from the database",
            "error"
          );
        }
      }
    });
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
    if (!validateDebts()) return;
    // Transform data to the required schema
    const transformedDebts = debts.map((debt) => ({
      debt_id: debt.id,
      debt_name: debt.debt_name || null,
      debt_types_id: debt.debt_types_id,
      amount: debt.amount,
      due_date: formatDate(debt.due_date) || null,
      debt_type_name:
        debtCategoryOptions.find(
          (category) => category.id === debt.debt_type_id
        )?.name || "",
    }));
    const combinedData = {
      ...state,
      debts: transformedDebts,
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
            <h3 style={{ fontSize: "2.1rem" }}>Set Your Debts</h3>
            <p className="mb-1" style={{ fontSize: ".95rem" }}>
              How much do you owe?
            </p>
          </div>
          <div className="d-flex align-items-end ml-3 pb-2">
            <Link
              to="#"
              className="btn btn-outline-secondary rounded-pill"
              onClick={addDebt}
              style={{ fontSize: ".9rem" }}
            >
              {debts.length === 0 ? "+ Create a debt" : "+ Add another debt"}
            </Link>
          </div>
        </div>
        <Container className="mx-0 px-0">
          <div className="d-flex px-0 row">
            {debts.map((debt, index) => (
              <Card
                key={index}
                className={`p-3 m-2 col card-bm ${
                  editableDebtId === debt.id ? "editable" : null
                }`}
                style={{ minHeight: "auto", maxWidth: "50%" }}
              >
                <div
                  key={debt.id}
                  className={`mb-0 ${
                    editableDebtId === debt.id ? "editable" : "non-editable"
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
                          <strong>Debt {index + 1}</strong>{" "}
                          <span style={{ fontSize: "1rem" }}>
                            {debt.debt_name ? " - " + debt.debt_name : ""}
                          </span>
                        </h5>
                        <div></div>
                      </div>
                    </div>
                    <div>
                      <div className="form-row">
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Debt name" className="mb-0">
                            <>
                              <Input
                                type="text"
                                value={debt.debt_name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    debt.id,
                                    "debt_name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. RBC credit card"
                                disabled={editableDebtId !== debt.id}
                                style={{ fontSize: ".8rem" }}
                                required
                              />
                              {debtErrors[index]?.debt_name && (
                                <div className="text-danger">
                                  {debtErrors[index].debt_name}
                                </div>
                              )}
                            </>
                          </Field>
                        </div>
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Debt category">
                            <>
                              <select
                                className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                                value={debt.debt_types_id || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    debt.id,
                                    "debt_types_id",
                                    Number(e.target.value)
                                  )
                                }
                                disabled={editableDebtId !== debt.id}
                                style={{ fontSize: ".8rem" }}
                                required
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
                              {debtErrors[index]?.debt_types_id && (
                                <div className="text-danger">
                                  {debtErrors[index].debt_types_id}
                                </div>
                              )}
                            </>
                          </Field>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Debt amount">
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
                                  value={debt.amount || ""}
                                  onChange={(e) =>
                                    handleNumberInputChange(
                                      debt.id,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "e") {
                                      e.preventDefault();
                                    }
                                  }}
                                  placeholder="e.g. 1500"
                                  className="form-control"
                                  step="100"
                                  min="0"
                                  disabled={editableDebtId !== debt.id}
                                  style={{ fontSize: ".8rem" }}
                                  required
                                />
                              </div>
                              {debt.amount_error && (
                                <div className="text-danger">
                                  {debt.amount_error}
                                </div>
                              )}
                              {debtErrors[index]?.amount && (
                                <div className="text-danger">
                                  {debtErrors[index]?.amount}
                                </div>
                              )}
                            </>
                          </Field>
                        </div>
                        <div className="col-md-6 form-group mb-0">
                          <Field label="Due date">
                            <>
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
                                min={new Date().toISOString().split("T")[0]}
                                disabled={editableDebtId !== debt.id}
                                style={{ fontSize: ".8rem" }}
                                required
                              />
                              {debtErrors[index]?.due_date && (
                                <div className="text-danger">
                                  {debtErrors[index].due_date}
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
                    onClick={() => setEditableDebt(debt.id)}
                  >
                    Edit
                  </button>
                  {debt.deletable === 1 || index > 0 ? (
                    <button
                      className="btn btn-danger btn-sm mt-1"
                      type="button"
                      onClick={() => deleteDebt(debt.id)}
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
