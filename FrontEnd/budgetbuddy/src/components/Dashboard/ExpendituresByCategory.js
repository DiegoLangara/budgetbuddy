import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

// Fetch expenditures from the backend
const fetchExpenditures = async (user_id, token, start_date, end_date) => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/dashboard/expendituresbycategory/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
          start_date: start_date,
          end_date: end_date,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch expenditures:", error);
    return [];
  }
}

export const ExpendituresByCategory = ({ startDate, endDate }) => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [expenditures, setExpenditures] = useState([]);

  useEffect(() => {
    if (token && user_id && startDate && endDate) {
      async function loadExpenditures() {
        const fetchedExpenditures = await fetchExpenditures(user_id, token, startDate, endDate);
        const formattedExpenditures = fetchedExpenditures.map((expenditure) => ({
          budget_name: expenditure.budget_name || '',
          expense: expenditure.expense || 0,
        }));
        setExpenditures(formattedExpenditures);
      }
      loadExpenditures();
    }
  }, [token, user_id, startDate, endDate]);

  // divide the data into labels and series
  const labels = expenditures.map((data) => data.budget_name);
  const series = expenditures.map((data) => data.expense);

  const options = {
    chart: {
      type: "donut",
      redrawOnParentResize: true,
      toolbar: {
        show: false,
      },
    },
    labels: labels,
  };

  return (
    <StyledExpendituresByCategory>
      <h3>Expenditures By Category</h3>
      <ReactApexChart options={options} series={series} type="donut" />
    </StyledExpendituresByCategory>
  );
};

const StyledExpendituresByCategory = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;