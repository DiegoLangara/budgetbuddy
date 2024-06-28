import React from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const TrackExpenses = () => {
  const monthlyExpenses = [
    {
      name: "Monthly Expenses",
      data: [1000, 800, 500, 300, 1200, 100, 50, 400, 900, 1000, 800, 500],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
    },
  };

  return (
    <StyledTrackExpensesWrapper>
      <h3>Actual Expense</h3>
      <ReactApexChart options={options} series={monthlyExpenses} type="bar" />
    </StyledTrackExpensesWrapper>
  );
};

const StyledTrackExpensesWrapper = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 2 / 3;
`;