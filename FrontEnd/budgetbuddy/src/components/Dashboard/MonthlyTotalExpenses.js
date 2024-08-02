import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Fetch monthly total expenses from the backend
const fetchMonthlyTotalExpenses = async (user_id, token) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_HOST+`/api/dashboard/monthlyexpenses/`,
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
    console.error("Failed to fetch monthly total expenses:", error);
    return [];
  }
};

export const MonthlyTotalExpenses = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (token && user_id) {
      async function loadMonthlyTotalExpenses() {
        const fetchedMonthlyTotalExpenses = await fetchMonthlyTotalExpenses(user_id, token);
        // Divide the fetched data into two array variables: one for the month and one for the total expenses
        const months = fetchedMonthlyTotalExpenses.map((data) => data.month);
        const total_expenses = fetchedMonthlyTotalExpenses.map((data) => data.total_expense);
        // Set the state of the monthly total expenses
        setCategories(months);
        setMonthlyTotalExpenses([
          {
            name: "Total Expenses",
            data: total_expenses,
          },
        ]);
      }
      loadMonthlyTotalExpenses();
    }
  }, [token, user_id]);

  const chkTotalExpenses = monthlyTotalExpenses.reduce((accumulator, series) => {
    return accumulator + series.data.reduce((sum, value) => sum + value, 0);
  }, 0);

  let noDataCheckFlag = chkTotalExpenses === 0 ? true : false;

  const handleNavigate = () => {
    navigate("/home/transactions");
  };

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
    },
    legend: {
      show: false,
    },
    colors: ["#F23645"],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ['#F23645'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <StyledMonthlyTotalExpenses>
      <StyledTitle>Monthly Total Expenses</StyledTitle>
      {noDataCheckFlag ? (
        <StyledNoDataWrapper>
          <StyledNoDataMessage>No Expenses.</StyledNoDataMessage>
          <StyledNoDataMessage>Let's create new transaction.</StyledNoDataMessage>
          <StyledButton
            type="button"
            onClick={handleNavigate}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 1rem" }}
          >
            {"+ "}Create transactions
          </StyledButton>
        </StyledNoDataWrapper>
      ) : <ReactApexChart options={options} series={monthlyTotalExpenses} type="bar" />
      }
    </StyledMonthlyTotalExpenses>
  );
};

const StyledTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StyledMonthlyTotalExpenses = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
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

const StyledButton = styled.button`
  margin-top: 1rem;
`;