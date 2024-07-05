import React from 'react';
import Chart from 'react-apexcharts';
import styled from 'styled-components';

export const BalanceOfBudgetAndExpenses = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
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
      categories: [
        'Rent', 'Hydro', 'Internet', 'Mobile', 'Groceries', 'Daily Necessities',
        'Education', 'Health', 'Clothing', 'Hobbies', 'Savings', 'Others'
      ],
    },
    colors: ['#1E90FF', '#FF4500'], // Blue and Red colors
    legend: {
      position: 'top',
    },
  };

  const series = [
    {
      name: 'Budget',
      data: [1000, 150, 200, 250, 500, 300, 150, 100, 200, 400, 750, 100],
    },
    {
      name: 'Expenses',
      data: [950, 100, 180, 230, 550, 320, 120, 80, 180, 380, 800, 120],
    },
  ];

  return (
    <StyledBar>
      <h3>Balance Of Budget And Expenses</h3>
      <Chart options={options} series={series} type={options.chart.type} />
    </StyledBar>
  );
};

const StyledBar = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 1 / 2;
`;
