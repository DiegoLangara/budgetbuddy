import React from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const FinancialSuggestionsSection = ({ suggestion, financialData }) => {

  // Divide the financialData into series and labels, if financialData is not null
  const series = financialData ? financialData.map((data) => data.budget) : [];
  const labels = financialData ? financialData.map((data) => data.category) : [];

  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    }
  };

  return (
    <StyledFinancialSuggestionsSection>
      <p>{suggestion}</p>
      {series.length > 0 && (
        <ReactApexChart options={options} series={series} type="donut" />
      )}
    </StyledFinancialSuggestionsSection>
  );
};

const StyledFinancialSuggestionsSection = styled.div`
  border: 1px solid #CBD5E1;
  border-radius: 5px;
  padding: 0.5rem;
`;