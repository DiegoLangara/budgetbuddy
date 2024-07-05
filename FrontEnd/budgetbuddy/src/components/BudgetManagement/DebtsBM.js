import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import logo from "../../Assets/Logonn.png";
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
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [debts, setDebts] = useState(
    state.debts || [{ id: 1, debt_types_id: 0 }]
  );
  const [expandedDebtId, setExpandedDebtId] = useState(debts[0]?.id || 1);

  useEffect(() => {
    async function loadDebts() {
      const fetchedDebts = await fetchDebts(user_id, token);
      const formattedDebts = fetchedDebts.map((debt, index) => ({
        id: debt.debt_id || index + 1,
        debt_name: debt.debt_name || "",
        debt_types_id: debt.debt_types_id ?? 0,
        amount: debt.amount || "",
        deletable: debt.deletable || "",
        due_date: debt.due_date ? formatDate(debt.due_date) : "",
      }));
      // Sort incomes by id in ascending order
      formattedDebts.sort((a, b) => a.id - b.id);

      setDebts(
        formattedDebts.length > 0
          ? formattedDebts
          : [{ id: 1, debt_types_id: 0 }]
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
    const newDebt = { id: newId, debt_types_id: 0 };
    const updatedDebts = [...debts, newDebt];
    updatedDebts.sort((a, b) => a.id - b.id); // Ensure order is maintained
    setDebts(updatedDebts);
    setExpandedDebtId(newDebt.id);
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
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDebts = debts.filter((debt) => debt.id !== id);
        setDebts(updatedDebts);
        setState({ ...state, debts: updatedDebts });
        setExpandedDebtId(updatedDebts.length > 0 ? updatedDebts[0].id : null);
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
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const saveData = async (event) => {
    event.preventDefault();
    // Transform data to the required schema
    const transformedDebts = debts.map((debt) => ({
      debt_id: debt.id,
      debt_name: debt.debt_name || null,
      debt_types_id: debt.debt_types_id,
      amount: debt.amount,
      due_date: formatDate(debt.due_date) || null,
    }));

    const combinedData = {
      ...state,
      debts: transformedDebts,
    };
    setState(combinedData);
    await saveToDatabase(combinedData);
    navigate("/home/budget");
  };

  const toggleDebt = (id) => {
    setExpandedDebtId(expandedDebtId === id ? null : id);
  };

  return (
    <div className="debts-background">
      <Container className="d-flex align-items-center justify-content-center debts-background-container">
        <Card className="card">
          <Card.Body className="mb-0">
            <div className="d-flex align-items-center mb-3">
              <img
                src={logo}
                alt="Debt Manager Logo"
                className="img-black w-2vw"
              />
              <h3 className="text-left mb-0 ml-1">Debt Manager</h3>
            </div>
            {/* <Progress /> */}
            <Form onSubmit={saveData} className="my-3 pb-0">
              <div className="container">
                <div className="row">
                  <div className="col px-0">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-0">
                      <h3 style={{ fontSize: "2.2rem" }}>Set Your Debts</h3>
                    </div>
                    <p className="mb-3" style={{ fontSize: "1rem" }}>
                      When and how much do you need to pay?
                    </p>

                    {debts.map((debt, index) => (
                      <div key={debt.id} className="accordion mb-0">
                        <div className="mt-1">
                          <div
                            className="accordion-header mb-1"
                            onClick={() => toggleDebt(debt.id)}
                            style={{
                              cursor: "pointer",
                              padding: ".3rem 0",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 style={{ margin: ".2rem 0" }}>
                                Debt {index + 1}{" "}
                                {expandedDebtId !== debt.id && debt.debt_name
                                  ? " - " + debt.debt_name
                                  : ""}
                              </h5>
                              {debt.deletable === 1 || index > 0 ? (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  type="button"
                                  onClick={() => deleteDebt(debt.id)}
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
                              <div className="accordion-body pt-2 px-0 container">
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Debt name" className="mb-0">
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
                                      />
                                    </Field>
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Debt category">
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
                                </div>
                                <div className="form-row">
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Debt amount">
                                      <div className="input-group">
                                        <span className="input-group-text bg-white">
                                          $
                                        </span>
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
                                          placeholder="e.g. 1500"
                                          className="form-control"
                                          step="100"
                                          min="0"
                                        />
                                      </div>
                                    </Field>
                                  </div>
                                  <div className="col-md-6 form-group mb-0">
                                    <Field label="Due date">
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
                      <Link to="#" className="mt-2" onClick={addDebt}>
                        {debts.length === 0
                          ? "Create a debt"
                          : "Add another debt"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="row btn-row">
                  <div className="col px-0 mt-5 pt-1">
                    <div className="d-flex justify-content-between mt-5 pt-5">
                      <Link
                        to="/home/budget"
                        className="btn btn-outline-secondary w-50"
                      >
                        Go back
                      </Link>
                      <BootstrapButton
                        type="submit"
                        className="btn btn-primary w-50 ml-3 w-50"
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