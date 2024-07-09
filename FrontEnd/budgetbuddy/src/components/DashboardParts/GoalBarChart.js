import React from "react";
import ApexChart from "react-apexcharts";

export const GoalBarChart = ({ description, savings, goal }) => {
  const percentage = Math.round((savings / goal) * 100);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "100%",
        borderRadius: 20 / 2,
        colors: {
          backgroundBarColors: ["#CBE6FF"],
          backgroundBarOpacity: 1,
        },
      },
    },
    xaxis: {
      categories: ["Savings"],
      max: 100,
    },
    fill: {
      colors: ["#001E30"],
    },
  };

  const series = [
    {
      name: "Savings",
      data: [percentage],
    },
  ];

  return (
    <>
      <div>
        {description} ({percentage}%)
      </div>
      <div>
        $ {savings} / $ {goal}
      </div>
      <ApexChart
        options={options}
        series={series}
        type="bar"
        height={20}
      />
    </>
  );
};
