import React from "react";
import { LinearProgress, Box, Typography } from '@mui/material';
import styled from "styled-components";

export const GoalBarChart = ({ description, savings, goal }) => {
  const formattedSavings = savings.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedGoal = goal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const percentage = Math.round((savings / goal) * 100);

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
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
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
  font-size: 11px;
  margin: 0;
  padding: 0;
`;
