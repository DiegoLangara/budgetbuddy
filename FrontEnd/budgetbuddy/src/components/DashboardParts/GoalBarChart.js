import React from "react";
import { LinearProgress, Box } from '@mui/material';
import styled from "styled-components";

export const GoalBarChart = ({ description, savings, goal }) => {
  const formattedSavings = savings.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedGoal = goal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const percentageForText = Math.round((savings / goal) * 100);
  const percentageForChart = percentageForText > 100 ? 100 : percentageForText;

  return (
    <StyledWrapper>
      <StyledTextWrapper>
        <StyledText>
          <StyledIcon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 20V4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 20V14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </StyledIcon>
          {description} ({percentageForText}%)
        </StyledText>
        <StyledText>
          {formattedSavings} / {formattedGoal}
        </StyledText>
      </StyledTextWrapper>
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentageForChart}
          sx={{
            height: 16,
            borderRadius: 5,
            backgroundColor: '#CBE6FF',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#001E30',
            },
          }}
        />
      </Box>
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
  font-size: 14px;
  margin: 0;
  padding: 0;
`;

const StyledIcon = styled.svg`
  margin-right: 0.5rem;
  margin-bottom: 0.1rem;
`;