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
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    colors: ['#005D5D', '#1192E8', '#520408', '#6929C4', '#9F1853', '#FA4D56'],
  };

  return (
    <StyledFinancialSuggestionsSection>
      <StyledText>{suggestion}</StyledText>
      {series.length > 0 && (
        <StyledReactApexChart options={options} series={series} type="donut" />
      )}
    </StyledFinancialSuggestionsSection>
  );
};

const StyledFinancialSuggestionsSection = styled.div`
  border: 1px solid #CBD5E1;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const StyledText = styled.p`
  margin: 0;
  font-size: 0.8rem;
`;

const StyledReactApexChart = styled(ReactApexChart)`
  margin-top: 1rem;
`;