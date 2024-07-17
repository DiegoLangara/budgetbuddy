import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Box } from '@mui/system';
import { Field } from '../OnboardingParts/Field';
import { Input } from '../OnboardingParts/Input';

// Fetch expenses from the backend
const fetchBudgetExpenses = async (user_id, token, start_date, end_date) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/budgetexpenses/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return [];
  }
}

export const BalanceOfBudgetAndExpenses = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDay = firstDay.toISOString().split('T')[0];
    const formattedLastDay = lastDay.toISOString().split('T')[0];

    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);
  }, []);

  useEffect(() => {
    if (token && user_id && startDate && endDate) {
      async function loadExpenses() {
        const fetchedExpenses = await fetchBudgetExpenses(user_id, token, startDate, endDate);
        const formattedExpenses = fetchedExpenses.map((expense) => ({
          budget_name: expense.budget_name || '',
          expense: expense.expense || 0,
          limit: expense.limit || 0,
        }));
        setExpenses(formattedExpenses);
      }
      loadExpenses();
    }
  }, [token, user_id, startDate, endDate]);

  const budget_name = expenses.map((data) => data.budget_name);
  const expense = expenses.map((data) => data.expense);
  const limit = expenses.map((data) => data.limit);

  const series = [
    { name: 'Budget', data: limit },
    { name: 'Expenses', data: expense },
  ];

  const options = {
    chart: {
      type: 'bar',
      redrawOnParentResize: true,
      toolbar: {
        show: false,
      },
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
      categories: budget_name,
    },
    colors: ['#22AB94', '#F23645'],
    legend: {
      position: 'bottom',
    },
  };

  return (
    <StyledBar>
      <StyledTitle>Budget And Expenses</StyledTitle>
      <Box display="flex" alignItems="stretch" gap={1}>
        <Field label="Start date">
          <StyledInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End date">
          <StyledInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </Box>
      <ApexChart options={options} series={series} type={options.chart.type} height={350} />
    </StyledBar>
  );
};

const StyledTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
`;

const StyledBar = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;

const StyledInput = styled(Input)`
  width: 90%;
  border-radius: 5px;
  border: 1px solid #ced4da;
  padding: 0 0.5rem;
`;
