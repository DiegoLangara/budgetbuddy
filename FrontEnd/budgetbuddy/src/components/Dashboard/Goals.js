import React from "react";
import ReactApexChart from "react-apexcharts";

export const Goals = ({ description, savings, goal }) => {
  const percentage = (savings / goal) * 100;

  const options = {
    chart: {
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
    <div id="chart" style={{ margin: "0 20px 0 20px" }}>
      <div style={{ textAlign: "left", marginTop: "10px", fontSize: "16px" }}>
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
        borderRadius={50}
      />
    </div>
  );
};
