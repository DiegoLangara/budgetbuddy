import { CompactTable } from "@table-library/react-table-library/compact";
import styled from "styled-components";

export const Category = () => {
  const nodes = [
    {
      category: "Auto",
      budget: 200.0,
      actual: 200.0,
      difference: 0.0,
    },
    {
      category: "Entertainment",
      budget: 75.0,
      actual: 32.0,
      difference: 43.0,
    },
    {
      category: "Food",
      budget: 100.0,
      actual: 200.0,
      difference: 100.0,
    },
    {
      category: "Home",
      budget: 200.0,
      actual: 200.0,
      difference: 0.0,
    },
    {
      category: "Medical",
      budget: 75.0,
      actual: 150.0,
      difference: 75.0,
    },
    {
      category: "Home",
      budget: 300.0,
      actual: 80.0,
      difference: 20.0,
    },
  ];

  const COLUMNS = [
    { label: "Category", renderCell: (item) => item.category },
    { label: "Budget", renderCell: (item) => item.budget },
    { label: "Actual", renderCell: (item) => item.actual },
    { label: "Difference", renderCell: (item) => item.difference },
  ];

  const data = { nodes };

  return (
    <StyledCategoryWrapper>
      <h3>Category</h3>
      <CompactTable columns={COLUMNS} data={data} />
    </StyledCategoryWrapper>
  );
};

const StyledCategoryWrapper = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  padding: 1rem;
  grid-column: 2 / 3;
`;
