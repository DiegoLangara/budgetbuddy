import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Input } from "../OnboardingParts/Input";
import "../../css/Debts.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Modal, Form as BootstrapForm } from "react-bootstrap";

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
    // console.log("Fetched data:", data);
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
    state.debts || [{ debt_id: 1, debt_types_id: 0 }]
  );
  const [editableDebtId, setEditableDebtId] = useState(null);
  const [debtErrors, setDebtErrors] = useState([]);
  const [savingDebtId, setSavingDebtId] = useState(null);
  const [addedDebt, setAddedDebt] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newDebt, setNewDebt] = useState({
    debt_name: "",
    debt_types_id: 0,
    amount: 0,
    due_date: "",
  });

  useEffect(() => {
    async function loadDebts() {
      const fetchedDebts = await fetchDebts(user_id, token);
      const formattedDebts = fetchedDebts.map((debt) => ({
        debt_id: debt.debt_id,
        debt_name: debt.debt_name || "",
        debt_types_id: debt.debt_types_id || 0,
        amount: debt.amount || 0,
        due_date: debt.due_date ? formatDate(debt.due_date) : "",
        deletable: debt.deletable || "",
      }));
      // Sort debts by id in ascending order
      formattedDebts.sort((a, b) => a.debt_id - b.debt_id);

      setDebts(
        formattedDebts.length > 0
          ? formattedDebts
          : [{ debt_id: 1, debt_types_id: 0 }]
      );
      setState({ ...state, debts: formattedDebts });
      setDebtErrors([]);
    }
    loadDebts();
  }, [user_id, token, setState, addedDebt]);

  const handleInputChange = (debt_id, field, value) => {
    if (editableDebtId !== debt_id) {
      setNewDebt((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.debt_id === debt_id ? { ...debt, [field]: value } : debt
      )
    );
  };

  const handleNumberInputChange = (debt_id, field, value) => {
    let errorMessage;

    if (!/^\d*\.?\d*$/.test(value)) {
      errorMessage = "Please enter a valid number.";
    } else if (parseFloat(value) < 0) {
      errorMessage = "Please enter a positive number.";
    }
    if (editableDebtId !== debt_id) {
      setNewDebt((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.debt_id === debt_id ? { ...debt, [field]: value } : debt
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const setEditableDebt = (debt_id) => {
    setEditableDebtId(debt_id);
  };

  const deleteDebtFromDatabase = async (user_id, token, debt_id) => {
    try {
      console.log(user_id, token, debt_id);
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debt/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            debt_id: debt_id,
            token: token,
            user_id: user_id,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete debt from the database");
      }
    } catch (error) {
      console.error("Failed to delete debt:", error);
      throw error;
    }
  };

  const deleteDebt = (debt_id) => {
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
          await deleteDebtFromDatabase(user_id, token, debt_id); // Delete from database first
          const updatedDebts = debts.filter((debt) => debt.debt_id !== debt_id);
          setDebts(updatedDebts);
          setState({ ...state, debts: updatedDebts });
          if (editableDebtId === debt_id) {
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

  // save(update) existing item
  const updateData = async (debt) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debt/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            debt_id: debt.debt_id,
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(debt),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);

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

  const handleUpdateData = async (debt) => {
    const validationErrors = validateDebts(debt);
    if (Object.keys(validationErrors).length === 0) {
      setSavingDebtId(debt.debt_id);
      await updateData(debt);
      console.log(debt);
      setEditableDebtId(null);
      setSavingDebtId(null);
    } else {
      setDebtErrors(validationErrors);
    }
  };

  // save new item
  const saveAddedData = async (debt) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debt/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(debt),
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

  const handleSaveAddedData = async (debt) => {
    if (!validateDebts()) return;
    // Transform data to the required schema
    const transformedDebt = {
      // debt_id: debt.id,
      debt_name: debt.debt_name || null,
      debt_types_id: debt.debt_types_id,
      amount: debt.amount,
      due_date: formatDate(debt.due_date) || null,
    };
    await saveAddedData(transformedDebt);
    setAddedDebt(transformedDebt);
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
          <h2 style={{ fontSize: "2.7rem" }}>Set Your Debts</h2>
          <p className="mb-1" style={{ fontSize: "1.2rem" }}>
            How much do you owe?
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
            {debts.length === 0 ? "+ Create a Debt" : "+ Add More Debts"}
          </Link>
        </div>
      </div>
      <div className="container-bm">
        {debts.map((debt, index) => (
          <div
            key={index}
            className={`p-3 m-0 card-bm ${
              editableDebtId === debt.debt_id ? "editable" : null
            }`}
            style={{ minHeight: "auto" }}
          >
            <div key={debt.debt_id}>
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
                        margin: debt.debt_name ? ".2rem 0" : "1.75rem 0 .2rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>
                        <strong>{debt.debt_name ? debt.debt_name : ""}</strong>
                      </span>
                    </h5>
                    <div></div>
                  </div>
                </div>
                <div
                  className={`mb-0 ${
                    editableDebtId === debt.debt_id
                      ? "editable"
                      : "non-editable"
                  }`}
                >
                  <div className="form-row">
                    <div className="col-md-6 mb-0">
                      <Field label="Debt name" className="mb-0">
                        <>
                          <Input
                            type="text"
                            value={debt.debt_name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                debt.debt_id,
                                "debt_name",
                                e.target.value
                              )
                            }
                            placeholder="e.g. RBC credit card"
                            disabled={editableDebtId !== debt.debt_id}
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
                    <div className="col-md-6 mb-0">
                      <Field label="Debt category">
                        <>
                          <select
                            className="form-select w-100 p-2 border border-secondary-subtle rounded"
                            value={debt.debt_types_id || 0}
                            onChange={(e) =>
                              handleInputChange(
                                debt.debt_id,
                                "debt_types_id",
                                Number(e.target.value)
                              )
                            }
                            disabled={editableDebtId !== debt.debt_id}
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
                    <div className="col-md-6 mb-0">
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
                                  debt.debt_id,
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
                              disabled={editableDebtId !== debt.debt_id}
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
                    <div className="col-md-6 mb-0">
                      <Field label="Due date">
                        <>
                          <Input
                            type="date"
                            value={debt.due_date || ""}
                            onChange={(e) =>
                              handleInputChange(
                                debt.debt_id,
                                "due_date",
                                e.target.value
                              )
                            }
                            min={new Date().toISOString().split("T")[0]}
                            disabled={editableDebtId !== debt.debt_id}
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
              {editableDebtId !== debt.debt_id ? (
                <a href="#/" onClick={() => setEditableDebt(debt.debt_id)}>
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
                <a href="#/" onClick={() => handleUpdateData(debt)}>
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
              <a href="#/" onClick={() => deleteDebt(debt.debt_id)}>
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
          <Modal.Title>Add New Debt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="debtName">
              <BootstrapForm.Label className="mt-2">
                Debt name
              </BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="debt_name"
                value={newDebt.debt_name}
                onChange={(e) =>
                  handleInputChange(
                    newDebt.debt_id,
                    "debt_name",
                    e.target.value
                  )
                }
                placeholder="ex. RBC credit card"
                style={{ fontSize: "1rem" }}
                required
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="debtCategory">
              <BootstrapForm.Label>Debt category</BootstrapForm.Label>
              <select
                className="form-select w-100 py-3 px-2 border border-secondary-subtle rounded"
                name="debt_types_id"
                value={newDebt.debt_types_id}
                onChange={(e) =>
                  handleInputChange(
                    newDebt.debt_id,
                    "debt_types_id",
                    Number(e.target.value)
                  )
                }
                style={{ fontSize: "1rem" }}
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
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="debtAmount">
              <BootstrapForm.Label>Debt amount</BootstrapForm.Label>
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
                  value={newDebt.amount}
                  onChange={(e) =>
                    handleNumberInputChange(
                      newDebt.debt_id,
                      "amount",
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="ex. 1500"
                  className="form-control"
                  step="100"
                  min="100"
                  style={{ fontSize: "1rem" }}
                  required
                />
              </div>
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="dueDate">
              <BootstrapForm.Label>Due date</BootstrapForm.Label>
              <BootstrapForm.Control
                type="date"
                name="due_date"
                value={newDebt.due_date}
                onChange={(e) =>
                  handleInputChange(newDebt.debt_id, "due_date", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                style={{ fontSize: "1rem" }}
                required
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <a href="#/" onClick={() => handleSaveAddedData(newDebt)}>
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
