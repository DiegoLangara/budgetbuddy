import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";
import "../../css/ExpenseTable.css";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Utility function to decode byte array to string
const decodeByteArray = (byteArray) => {
  return String.fromCharCode(...byteArray);
};

// Fetch all transactions from API
async function fetchLatestTransaction(token, user_id) {
  try {
    console.log(
      `Fetching transactions with user_id=${user_id}, token=${token}`
    );
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/transactions/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          user_id: user_id,
          token: token,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

export const ExpenseTableLatest = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  // state to edit/delete each item
  const [transactions, setTransactions] = useState(
    state.transactions || [{ id: 1 }]
  );
  // state for viewing each item
  const [showModal, setShowModal] = useState(false);
  const [viewableTransaction, setViewableTransaction] = useState(null);
  // state for table sorting based on selected table header column
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    if (token && user_id) {
      async function loadTransactions() {
        const fetchedTransactions = await fetchLatestTransaction(
          token,
          user_id
        );
        const formattedTransactions = fetchedTransactions.map(
          (transaction) => ({
            id: transaction.transaction_id,
            transaction_date: transaction.transaction_date
              ? formatDate(transaction.transaction_date)
              : "",
            transaction_category: transaction.transaction_category || "",
            transaction_name: transaction.transaction_payee || "",
            transaction_note: transaction.transaction_note || "",
            transaction_amount: transaction.transaction_amount || 0,
            transaction_type: transaction.transaction_type || "",
            transaction_image_url: transaction.transaction_image_url
              ? decodeByteArray(transaction.transaction_image_url.data)
              : "",
          })
        );
        // Sort by date & id in descending order
        const sortedFormattedTransactions = formattedTransactions.sort(
          (a, b) => {
            if (b.transaction_date === a.transaction_date) {
              return b.id - a.id;
            }
            return b.transaction_date - a.transaction_date;
          }
        );
        setTransactions(sortedFormattedTransactions);
      }
      loadTransactions();
    }
  }, [token, user_id]);

  let noDataCheckFlag = transactions.length === 0 ? true : false;

  // Sorting table items
  const sortedTransactions = [...transactions];
  if (sortConfig.key !== null) {
    sortedTransactions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      } else if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }
  // Changing sort directions
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleViewClick = (transaction) => {
    setViewableTransaction(transaction);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setViewableTransaction(null);
  };

  const handleNavigate = () => {
    navigate("/home/transactions");
  };

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledTitle>Latest transactions</StyledTitle>
        <button
          type="button"
          onClick={handleNavigate}
          className="btn"
          style={{
            padding: ".1rem 1.5rem",
            backgroundColor: "#C9EEA7",
            fontWeight: "bold",
          }}
        >
          {"+ "}Create
        </button>
      </StyledHeader>
      {noDataCheckFlag ? (
        <StyledNoDataWrapper>
          <StyledNoDataMessage>No transactions.</StyledNoDataMessage>
          <StyledNoDataMessage>
            Let's create new transaction.
          </StyledNoDataMessage>
        </StyledNoDataWrapper>
      ) : (
        <div className="scrollable-table-dashboard shadow">
          <table className="responsive-table responsive-table-latest">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("transaction_date")}
                  style={{ cursor: "pointer" }}
                >
                  Date
                  {sortConfig.key === "transaction_date" ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-up-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    )
                  ) : null}
                </th>
                <th
                  onClick={() => handleSort("transaction_category")}
                  style={{ cursor: "pointer" }}
                >
                  Category
                  {sortConfig.key === "transaction_category" ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-up-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    )
                  ) : null}
                </th>
                <th
                  onClick={() => handleSort("transaction_name")}
                  style={{ cursor: "pointer" }}
                >
                  Name
                  {sortConfig.key === "transaction_name" ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-up-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    )
                  ) : null}
                </th>
                <th
                  onClick={() => handleSort("transaction_note")}
                  style={{ cursor: "pointer" }}
                >
                  Note
                  {sortConfig.key === "transaction_note" ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-up-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    )
                  ) : null}
                </th>
                <th
                  onClick={() => handleSort("transaction_amount")}
                  style={{ cursor: "pointer" }}
                >
                  Amount
                  {sortConfig.key === "transaction_amount" ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-up-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    )
                  ) : null}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((data) => (
                <tr key={data.id}>
                  <td data-label="Date">{data.transaction_date}</td>
                  <td data-label="Category">{data.transaction_category}</td>
                  <td data-label="Name">{data.transaction_name}</td>
                  <td data-label="Note">{data.transaction_note}</td>
                  <td
                    data-label="Amount"
                    className={data.transaction_amount > 0 ? "plus" : "minus"}
                  >
                    {data.transaction_amount}
                  </td>

                  <td data-label="">
                    <div className="icons">
                      <a href="#/" onClick={() => handleViewClick(data)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-arrow-up-right-square"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"
                          />
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {viewableTransaction && (
            <Modal show={showModal} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>View Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <BootstrapForm>
                  <BootstrapForm.Group controlId="transactionDate">
                    <BootstrapForm.Label>Date</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="date"
                      defaultValue={viewableTransaction.transaction_date}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionCategory">
                    <BootstrapForm.Label>Category</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="text"
                      defaultValue={viewableTransaction.transaction_category}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionName">
                    <BootstrapForm.Label>Name</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="text"
                      defaultValue={viewableTransaction.transaction_name}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionNote">
                    <BootstrapForm.Label>Note</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="text"
                      defaultValue={viewableTransaction.transaction_note}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionAmount">
                    <BootstrapForm.Label>Amount</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="number"
                      defaultValue={viewableTransaction.transaction_amount}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionType">
                    <BootstrapForm.Label>Type</BootstrapForm.Label>
                    <BootstrapForm.Control
                      type="text"
                      defaultValue={viewableTransaction.transaction_type}
                      readOnly
                    />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group controlId="transactionImageURL">
                    <BootstrapForm.Label>Image</BootstrapForm.Label>
                    {viewableTransaction.transaction_image_url && (
                      <div className="transaction-image">
                        <img
                          src={viewableTransaction.transaction_image_url}
                          alt="Transaction"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    )}
                  </BootstrapForm.Group>
                </BootstrapForm>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
  grid-column: 1 / 3;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StyledTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 0rem;
`;

const StyledNoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const StyledNoDataMessage = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0;
`;
