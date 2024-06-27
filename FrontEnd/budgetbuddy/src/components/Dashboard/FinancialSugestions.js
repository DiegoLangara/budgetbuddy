import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import ReactDOM from "react-dom";

export const FinancialSugestions = () => {
  const [series, setSeries] = useState([44, 55, 41, 17, 15]);
  const [options, setOptions] = useState({
    chart: {
      type: "donut",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
