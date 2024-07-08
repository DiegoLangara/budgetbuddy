import React, { useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate() + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fetch expenses from the backend
const fetchExpenses = async (user_id, token) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/expenses/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    console.error('Failed to fetch expenses:', error);
    return [];
  }
}

export const BalanceOfBudgetAndExpenses = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [expenses, setExpenses] = useState([]);

  // TODO Fetch expenses from the backend

  const fetchedData = [
    {
      "budget_name": "Rent",
      "amount": 900,
      "expenses": 900
    },
    {
      "budget_name": "Groceries",
      "amount": 300,
      "expenses": 150
    },
    {
      "budget_name": "Networking",
      "amount": 100,
      "expenses": 120
    },
    {
      "budget_name": "Internet",
      "amount": 50,
      "expenses": 50
    },
    {
      "budget_name": "Mobile",
      "amount": 30,
      "expenses": 40
    },
    {
      "budget_name": "Restaurants",
      "amount": 30,
      "expenses": 15
    },
  ];
  const categories = fetchedData.map((data) => data.budget_name);
  const budgetData = fetchedData.map((data) => data.amount);
  const expensesData = fetchedData.map((data) => data.expenses);

  const series = [
    { name: 'Budget', data: budgetData, },
    { name: 'Expenses', data: expensesData, },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    colors: ['#1E90FF', '#FF4500'], // Blue and Red colors
    legend: {
      position: 'bottom',
    },
  };

  return (
    <StyledBar>
      <h3>Balance Of Budget And Expenses</h3>
      <ApexChart options={options} series={series} type={options.chart.type} height={350} />
    </StyledBar>
  );
};

const StyledBar = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
`;
