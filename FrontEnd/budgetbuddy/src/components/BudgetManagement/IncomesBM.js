import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Input } from "../OnboardingParts/Input";
import "../../css/Incomes.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Modal, Form as BootstrapForm } from "react-bootstrap";

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
    // console.log("Fetched data:", data);
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

export const IncomesBM = () => {
  const [state, setState] = useOnboardingState();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [incomes, setIncomes] = useState(
    state.incomes || [{ income_id: 1, income_type_id: 0 }]
  );
  const [editableIncomeId, setEditableIncomeId] = useState(null);
  const [incomeErrors, setIncomeErrors] = useState([]);
  const [savingIncomeId, setSavingIncomeId] = useState(null);
  const [addedIncome, setAddedIncome] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newIncome, setNewIncome] = useState({
    income_name: "",
    income_type_id: 0,
    amount: 0,
    period: "",
    // create_transaction: "",
  });

  // Fetch incomes on component mount
  useEffect(() => {
    async function loadIncomes() {
      const fetchedIncomes = await fetchIncomes(user_id, token);
      const formattedIncomes = fetchedIncomes.map((income) => ({
        income_id: income.income_id,
        income_name: income.income_name || "",
        income_type_id: income.income_type_id || 0,
        amount: income.amount || 0,
        period: periodNameToId[income.period] || 0,
        deletable: income.deletable || "",
      }));
      // Sort incomes by id in ascending order
      formattedIncomes.sort((a, b) => a.income_id - b.income_id);

      setIncomes(
        formattedIncomes.length > 0
          ? formattedIncomes
          : [{ income_id: 1, income_type_id: 0 }]
      );
      setState({ ...state, incomes: formattedIncomes });
      setIncomeErrors([]);
    }
    loadIncomes();
  }, [user_id, token, setState, addedIncome]);

  const handleInputChange = (income_id, field, value) => {
    if (editableIncomeId !== income_id) {
      setNewIncome((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setIncomes((prevIncomes) =>
      prevIncomes.map((income) =>
        income.income_id === income_id ? { ...income, [field]: value } : income
      )
    );
  };

  const handleNumberInputChange = (income_id, field, value) => {
    let errorMessage;

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }

    if (editableIncomeId !== income_id) {
      setNewIncome((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setIncomes((prevIncomes) =>
      prevIncomes.map((income) =>
        income.income_id === income_id ? { ...income, [field]: value } : income
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const setEditableIncome = (income_id) => {
    setEditableIncomeId(income_id);
  };

  const deleteIncomeFromDatabase = async (user_id, token, income_id) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/income/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            income_id: income_id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete income from the database");
      }
    } catch (error) {
      console.error("Failed to delete income:", error);
      throw error;
    }
  };

  const deleteIncome = (income_id) => {
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
          await deleteIncomeFromDatabase(user_id, token, income_id); // Delete from database first
          const updatedIncomes = incomes.filter(
            (income) => income.income_id !== income_id
          );
          setIncomes(updatedIncomes);
          setState({ ...state, incomes: updatedIncomes });
          if (editableIncomeId === income_id) {
            setEditableIncomeId(null);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Failed to delete income from the database",
            "error"
          );
        }
      }
    });
  };

  // save(update) existing item
  const updateData = async (income) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/income/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            income_id: income.income_id,
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(income),
        }
      );
      // console.log(JSON.stringify(income));
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

  const handleUpdateData = async (income) => {
    const validationErrors = validateIncomes(income);
    if (Object.keys(validationErrors).length === 0) {
      setSavingIncomeId(income.income_id);
      await updateData(income);
      setEditableIncomeId(null);
      setSavingIncomeId(null);
    } else {
      setIncomeErrors(validationErrors);
    }
  };

  // save new item
  const saveAddedData = async (income) => {
    console.log(income);
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/income/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(income),
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

  const handleSaveAddedData = async (income) => {
    if (!validateIncomes()) return;
    // Transform data to the required schema
    const transformedIncome = {
      // income_id: income.income_id,
      income_name: income.income_name || null,
      income_type_id: income.income_type_id,
      amount: income.amount,
      period: periodIdToName[income.period],
      // create_transaction: "",
    };
    await saveAddedData(transformedIncome);
    setAddedIncome(transformedIncome);
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
        <h2 style={{ fontSize: "2.7rem" }}>Set Your Incomes</h2>
          <p className="mb-1" style={{ fontSize: "1.2rem" }}>
            How much do you earn?
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
            {incomes.length === 0 ? "+ Create an Income" : "+ Add More Incomes"}
          </Link>
        </div>
      </div>
      <div className="container-bm">
        {incomes.map((income, index) => (
          <div
            key={index}
            className={`p-3 m-0 card-bm ${
              editableIncomeId === income.income_id ? "editable" : null
            }`}
            style={{ minHeight: "auto" }}
          >
            <div key={income.income_id}>
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
                        margin: income.income_name
                          ? ".2rem 0"
                          : "1.75rem 0 .2rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>
                        <strong>
                          {income.income_name ? income.income_name : ""}
                        </strong>
                      </span>
                    </h5>
                    <div></div>
                  </div>
                </div>
                <div
                  className={`card-content-bm mb-0 ${
                    editableIncomeId === income.income_id
                      ? "editable"
                      : "non-editable"
                  }`}
                >
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="Income name" className="mb-0">
                        <>
                          <Input
                            type="text"
                            value={income.income_name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                income.income_id,
                                "income_name",
                                e.target.value
                              )
                            }
                            placeholder="ex. House rental"
                            disabled={editableIncomeId !== income.income_id}
                            style={{ fontSize: ".8rem" }}
                            required
                          />
                          {incomeErrors[index]?.income_name && (
                            <div className="text-danger">
                              {incomeErrors[index]?.income_name}
                            </div>
                          )}
                        </>
                      </Field>
                    </div>
                    <div className="col-md-6 mb-0">
                      <Field label="Income category">
                        <>
                          <div className="mt-0">
                            <select
                              className="form-select w-100 p-2 border border-secondary-subtle rounded"
                              value={income.income_type_id || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  income.income_id,
                                  "income_type_id",
                                  Number(e.target.value)
                                )
                              }
                              disabled={editableIncomeId !== income.income_id}
                              style={{ fontSize: ".8rem" }}
                              required
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
                          {incomeErrors[index]?.income_type_id && (
                            <div className="text-danger">
                              {incomeErrors[index]?.income_type_id}
                            </div>
                          )}
                        </>
                      </Field>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="Income amount">
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
                                value={income.amount || ""}
                                onChange={(e) =>
                                  handleNumberInputChange(
                                    income.income_id,
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
                                disabled={editableIncomeId !== income.income_id}
                                style={{ fontSize: ".8rem" }}
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
                    <div className="col-md-6 mb-0">
                      <Field label="Income period">
                        <>
                          <div className="mt-0">
                            <select
                              className="form-select w-100 p-2 border border-secondary-subtle rounded"
                              value={income.period || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  income.income_id,
                                  "period",
                                  Number(e.target.value)
                                )
                              }
                              disabled={editableIncomeId !== income.income_id}
                              style={{ fontSize: ".8rem" }}
                              required
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
            </div>
            <div className="d-flex justify-content-end">
              {editableIncomeId !== income.income_id ? (
                <a
                  href="#/"
                  onClick={() => setEditableIncome(income.income_id)}
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
                <a href="#/" onClick={() => handleUpdateData(income)}>
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
              <a href="#/" onClick={() => deleteIncome(income.income_id)}>
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
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>Add New Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="incomeName">
              <BootstrapForm.Label className="mt-2">
                Income name
              </BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="income_name"
                value={newIncome.income_name}
                onChange={(e) =>
                  handleInputChange(
                    newIncome.income_id,
                    "income_name",
                    e.target.value
                  )
                }
                placeholder="ex. House rental"
                style={{ fontSize: "1rem" }}
                required
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="incomeCategory">
              <BootstrapForm.Label>Income category</BootstrapForm.Label>
              <select
                className="form-select w-100 py-3 px-2 border border-secondary-subtle rounded"
                name="income_type_id"
                value={newIncome.income_type_id}
                onChange={(e) =>
                  handleInputChange(
                    newIncome.income_id,
                    "income_type_id",
                    Number(e.target.value)
                  )
                }
                style={{ fontSize: "1rem" }}
                required
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
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="incomeAmount">
              <BootstrapForm.Label>Income amount</BootstrapForm.Label>
              <div className="input-group">
                <span
                  className="input-group-text bg-white"
                  style={{ fontSize: "1rem" }}
                >
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={newIncome.amount}
                  onChange={(e) =>
                    handleNumberInputChange(
                      newIncome.income_id,
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
                  min="100"
                  style={{ fontSize: "1rem" }}
                  required
                />
              </div>
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="incomePeriod">
              <BootstrapForm.Label>Income period</BootstrapForm.Label>
              <select
                className="form-select w-100 py-3 px-2 border border-secondary-subtle rounded"
                name="period"
                value={newIncome.period}
                onChange={(e) =>
                  handleInputChange(
                    newIncome.income_id,
                    "period",
                    Number(e.target.value)
                  )
                }
                style={{ fontSize: "1rem" }}
                required
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
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <a href="#/" onClick={() => handleSaveAddedData(newIncome)}>
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
