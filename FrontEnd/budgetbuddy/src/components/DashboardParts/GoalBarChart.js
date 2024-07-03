import React from "react";
import ReactApexChart from "react-apexcharts";

export const GoalBarChart = ({ description, savings, goal }) => {
  const percentage = (savings / goal) * 100;

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
        colors: {
          backgroundBarColors: ["#CBE6FF"],
          backgroundBarOpacity: 1,
        },
      },
    },
    // dataLabels: {
    //   enabled: true,
    //   formatter: function (val) {
    //     return `${val}%`;
    //   },
    //   offsetX: 0,
    //   style: {
    //     colors: ["#CBE6FF"],
    //   },
    // },
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
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={20}
      />
    </>
  );
};
