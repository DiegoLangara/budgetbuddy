import React from "react";
import { FinancialSuggestionsSection } from "../DashboardParts/FinancialSuggestionsSection";
import styled from "styled-components";

export const FinancialSuggestions = () => {

  const jsonData = [
    [
      {
        suggestion: "As of August 3rd, 2024, you have successfully logged into Budget Buddy. Please keep your password secure and do not share it with anyone.",
      },
    ],
    [
      {
        suggestion: "As of August 1st, 2024, your debts has significantly decreased. Please continue making your payments to further benefit your financial health. Keep up the good work! Here’s the actual summary of your expenses for the month of May 2024.",
      },
      {
        financialData: [
          {
            category: "Entertainment",
            budget: 6,
          },
          {
            category: "Food",
            budget: 8,
          },
          {
            category: "Home",
            budget: 10,
          },
          {
            category: "Medical",
            budget: 14,
          },
          {
            category: "Personal",
            budget: 28,
          },
          {
            category: "Auto",
            budget: 28,
          },
        ],
      },
    ],
  ];


  return (
    <StyledFinancialSuggestions>
      <StyledContentWrapper>
        <StyledTitle>Insight</StyledTitle>
        {jsonData.map((data, index) => (
          <FinancialSuggestionsSection
            key={index}
            suggestion={data[0].suggestion}
            financialData={data[1] ? data[1].financialData : null}
          />
        ))}
      </StyledContentWrapper>
    </StyledFinancialSuggestions>
  );
};

const StyledFinancialSuggestions = styled.div`
  grid-column: 3 / 4;
  grid-row: 1 / 5;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;

  @media (max-width: 1200px) {
    grid-column: 1 / 3;
    grid-row: 4 / 5;
  }
`;

const StyledTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 2rem;
`;

const StyledContentWrapper = styled.div`
  position: sticky;
  top: 10px;
`;