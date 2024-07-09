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
        show: true,
      },
      redrawOnParentResize: true,
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
      <ReactApexChart options={options} series={monthlyBudget} type="bar" />
    </StyledMonthlyTotalExpenses>
  );
};

const StyledMonthlyTotalExpenses = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;
