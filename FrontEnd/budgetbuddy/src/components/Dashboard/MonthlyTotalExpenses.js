import React from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const MonthlyTotalExpenses = () => {
  const monthlyBudget = [
    {
      name: "Monthly Budget",
      data: [1000, 800, 500, 300, 1200, 100, 50, 400, 900, 1000, 800, 500],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
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
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    colors: ["#1ABC9C", "#9B59B6"], // Custom colors for each bar
  };

  return (
    <StyledMonthlyTotalExpenses>
      <h3>Monthly Total Expenses</h3>
      <ReactApexChart options={options} series={monthlyBudget} type="bar" />
    </StyledMonthlyTotalExpenses>
  );
};

const StyledMonthlyTotalExpenses = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 2 / 3;
`;