import React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import styled from "styled-components";

export const Income = () => {
  const nodes = [
    {
      jobTitle: "Full-time Job",
      salary: 5000.00,
    },
    {
      jobTitle: "part-time Job",
      salary: 1000.00,
    },
  ];

  const COLUMNS = [
    { label: "Job Title", renderCell: (item) => item.jobTitle },
    { label: "Salary", renderCell: (item) => item.salary },
  ];

  const data = { nodes };

  return (
    <StyledCategoryWrapper>
      <h3>Source of Income</h3>
      <CompactTable columns={COLUMNS} data={data} />
    </StyledCategoryWrapper>
  );
};

const StyledCategoryWrapper = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 1 / 3;
`;
