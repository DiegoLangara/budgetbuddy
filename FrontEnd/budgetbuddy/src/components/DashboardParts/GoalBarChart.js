import React from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";

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
    <StyledWrapper>
      <StyledTextWrapper>
        <StyledText>
          {description} ({percentage}%)
        </StyledText>
        <StyledText>
          $ {savings} / $ {goal}
        </StyledText>
      </StyledTextWrapper>
      <ApexChart options={options} series={series} type="bar" height={20} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-bottom: 2rem;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledText = styled.p`
  margin: 0;
  padding: 0;
`;
