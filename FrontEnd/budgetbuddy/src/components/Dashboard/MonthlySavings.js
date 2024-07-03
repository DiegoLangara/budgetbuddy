import React from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const MonthlySavings = () => {
  const monthlySavings = [
    {
      name: "Monthly Savings",
      data: [1000, 1200, 1000, 900, 900, 800, 700, 100, 200, 500, 700, 900],
    },
  ];

  const options = {
    dataLabels: {
      enabled: false
    },
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
    colors: ["#fbbc04"], // Custom colors for each bar
  };

  return (
    <StyledMonthlySavings>
      <h3>Monthly Savings</h3>
      <ReactApexChart options={options} series={monthlySavings} type="area" />
    </StyledMonthlySavings>
  );
};

const StyledMonthlySavings = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 2 / 3;
`;
