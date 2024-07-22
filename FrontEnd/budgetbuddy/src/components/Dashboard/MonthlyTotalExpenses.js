import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";

// Fetch monthly total expenses from the backend
const fetchMonthlyTotalExpenses = async (user_id, token) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/monthlyexpenses/`,
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
      <ReactApexChart options={options} series={monthlyTotalExpenses} type="bar" />
    </StyledMonthlyTotalExpenses>
  );
};

const StyledTitle = styled.h4`
  font-weight: bold;
`;

const StyledMonthlyTotalExpenses = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;
