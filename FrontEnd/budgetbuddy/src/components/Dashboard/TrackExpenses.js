import React from "react";
import ReactApexChart from "react-apexcharts";
export const TrackExpenses = () => {
  const monthlyExpenses = [
    {
      name: "Monthly Expenses",
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
  };

  return (
    <>
      <h3>Actual Expense</h3>
      <ReactApexChart options={options} series={monthlyExpenses} type="bar" />
    </>
  );
};
