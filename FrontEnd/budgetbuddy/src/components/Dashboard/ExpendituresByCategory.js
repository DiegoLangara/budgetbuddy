import React from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const ExpendituresByCategory = ({ suggestion, financialData }) => {

  const jsonData = [
    {
      category: "Rent",
      budget: 1000,
    },
    {
      category: "Hydro",
      budget: 80,
    },
    {
      category: "Internet",
      budget: 100,
    },
    {
      category: "Mobile",
      budget: 60,
    },
    {
      category: "Groceries",
      budget: 350,
    },
    {
      category: "Daily Necessities",
      budget: 80,
    },
    {
      category: "Education",
      budget: 70,
    },
    {
      category: "Health",
      budget: 0,
    },
    {
      category: "Clothing",
      budget: 60,
    },
    {
      category: "Hobbies",
      budget: 400,
    },
    {
      category: "Savings",
      budget: 750,
    },
    {
      category: "Others",
      budget: 20,
    },
  ];

  // divide the data into labels and series
  const labels = jsonData.map((data) => data.category);
  const series = jsonData.map((data) => data.budget);

  const options = {
    chart: {
      type: "donut",
      redrawOnParentResize: true,
      toolbar: {
        show: false,
      },
    },
    labels: labels,
  };

  return (
    <StyledExpendituresByCategory>
      <h3>Expenditures By Category</h3>
      <ReactApexChart options={options} series={series} type="donut" />
    </StyledExpendituresByCategory>
  );
};

const StyledExpendituresByCategory = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;