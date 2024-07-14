import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { Box } from '@mui/system';
import { Field } from '../OnboardingParts/Field';
import { Input } from '../OnboardingParts/Input';
import { Button } from 'react-bootstrap';

// Fetch expenditures from the backend
const fetchExpenditures = async (user_id, token, start_date, end_date) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/expendituresbycategory/`,
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
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch expenditures:", error);
    return [];
  }
}

export const ExpendituresByCategory = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDay = firstDay.toISOString().split('T')[0];
    const formattedLastDay = lastDay.toISOString().split('T')[0];

    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);
    setAppliedStartDate(formattedFirstDay);
    setAppliedEndDate(formattedLastDay);
  }, []);

  const handleApply = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [expenditures, setExpenditures] = useState([]);

  useEffect(() => {
    if (token && user_id && appliedStartDate && appliedEndDate) {
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
  }, [token, user_id, appliedStartDate, appliedEndDate]);

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
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    }
  };

  return (
    <StyledExpendituresByCategory>
      <h3>Expenditures By Category</h3>
      <Box sx={{ width: '100%' }} display="flex" alignItems="stretch" gap={1}>
        <Field label="Start date">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End date">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
        <Field>
          <Button onClick={handleApply} style={{ marginTop: "2rem" }}>Apply</Button>
        </Field>
      </Box>
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