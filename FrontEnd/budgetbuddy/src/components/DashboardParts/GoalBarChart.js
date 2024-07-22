import React from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";

export const GoalBarChart = ({ description, savings, goal }) => {
  const formattedSavings = savings.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedGoal = goal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
        barHeight: "16px",
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
    <StyledWrapper>
      <StyledTextWrapper>
        <StyledText>
          {description} ({percentage}%)
        </StyledText>
        <StyledText>
          {formattedSavings} / {formattedGoal}
        </StyledText>
      </StyledTextWrapper>
      <ApexChart options={options} series={series} type="bar" height={20} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-bottom: 19px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledText = styled.p`
  font-size: 11px;
  margin: 0;
  padding: 0;
`;
