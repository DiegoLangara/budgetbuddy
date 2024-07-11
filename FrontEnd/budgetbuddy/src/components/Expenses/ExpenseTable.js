import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/ExpenseTable.css";

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fetch all transactions from API
async function fetchAllTransactions(token, user_id, start_date, end_date) {
  try {
    console.log(
      `Fetching transactions with user_id=${user_id}, token=${token}, start_date=${start_date}, end_date=${end_date}`
    );
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/transactions/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          user_id: user_id,
          token: token,
          start_date: start_date,
          end_date: end_date,
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

export const ExpenseTable = ({ startDate, endDate, category }) => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (token && user_id && startDate && endDate) {
      async function loadTransactions() {
        const fetchedTransactions = await fetchAllTransactions(
          token,
          user_id,
          startDate,
          endDate
        );
        const formattedTransactions = fetchedTransactions.map(
          (transaction) => ({
            id: transaction.id,
            transaction_date: transaction.transaction_date
              ? formatDate(transaction.transaction_date)
              : "",
            transaction_category: transaction.transaction_category || "",
            transaction_name: transaction.transaction_payee || "",
            transaction_note: transaction.transaction_note || "",
            transaction_amount: transaction.transaction_amount || 0,
          })
        );
        setTransactions(formattedTransactions);
      }
      loadTransactions();
    }
  }, [token, user_id, startDate, endDate]);

  // Filter transactions based on the selected category
  const filteredTransactions =
    category === "All types" || category === ""
      ? transactions
      : transactions.filter(
          (transaction) => transaction.transaction_category === category
        );

  return (
    <table className="responsive-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Name</th>
          <th>Note</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filteredTransactions.map((data) => (
          <tr key={data.id}>
            <td data-label="Date">{data.transaction_date}</td>
            <td data-label="Type">{data.transaction_category}</td>
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
                <a href="#/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                    />
                  </svg>
                </a>
                <a href="#/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
