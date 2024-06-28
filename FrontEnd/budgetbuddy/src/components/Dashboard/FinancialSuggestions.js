import React from "react";
import { FinancialSuggestionsSection } from "../DashboardParts/FinancialSuggestionsSection";
import styled from "styled-components";

export const FinancialSuggestions = () => {
  const jsonData = [
    [
      {
        suggestion: "As of June 5, 2024, you have successfully logged into Budget Buddy. Please keep your password secure and do not share it with anyone.",
      },
    ],
    [
      {
        suggestion: "As of May 30, 2024, your debts has significantly decreased. Please continue making your payments to further benefit your financial health. Keep up the good work! Here’s the actual summary of your expenses for the month of May 2024.",
      },
      {
        financialData: [
          {
            category: "Entertainment",
            budget: 1000,
          },
          {
            category: "Food",
            budget: 800,
          },
          {
            category: "Home",
            budget: 1600,
          },
          {
            category: "Medical",
            budget: 500,
          },
          {
            category: "Personal Items",
            budget: 700,
          },
        ],
      },
    ],
    [
      {
        suggestion: "As of May 30, 2024, your debts has significantly decreased. Please continue making your payments to further benefit your financial health. Keep up the good work! Here’s the actual summary of your expenses for the month of May 2024.",
      },
      {
        financialData: [
          {
            category: "Entertainment",
            budget: 1000,
          },
          {
            category: "Food",
            budget: 800,
          },
          {
            category: "Home",
            budget: 1600,
          },
          {
            category: "Medical",
            budget: 500,
          },
          {
            category: "Personal Items",
            budget: 700,
          },
        ],
      },
    ],
    [
      {
        suggestion: "As of June 5, 2024, you have successfully logged into Budget Buddy. Please keep your password secure and do not share it with anyone.",
      },
    ],
  ];

  return (
    <StyledFinancialSuggestions>
      <h3>Insight</h3>
      {jsonData.map((data, index) => (
        <FinancialSuggestionsSection
          key={index}
          suggestion={data[0].suggestion}
          financialData={data[1] ? data[1].financialData : null}
        />
      ))}
    </StyledFinancialSuggestions>
  );
};

const StyledFinancialSuggestions = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 7 / 9;
  grid-row: 1 / 3;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
`;