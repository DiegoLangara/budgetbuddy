import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";

// Fetch monthly total expenses from the backend
const fetchMonthlyTotalExpenses = async (user_id, token) => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/dashboard/monthlyexpenses/`,
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
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    colors: ["#22AB94"],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ['#22AB94'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    }
  };

  return (
    <StyledMonthlyTotalExpenses>
      <h3>Monthly Total Expenses</h3>
      <ReactApexChart options={options} series={monthlyTotalExpenses} type="bar" />
    </StyledMonthlyTotalExpenses>
  );
};

const StyledMonthlyTotalExpenses = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;
