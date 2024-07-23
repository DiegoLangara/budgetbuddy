import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Field } from "../components/OnboardingParts/Field";
import { Input } from "../components/OnboardingParts/Input";
import { Button } from "react-bootstrap";
import { ExpenseTable } from "../components/Expenses/ExpenseTable";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import styled from "styled-components";

const transactionCategories = [
  "All categories",
  "goals",
  "income",
  "budgets",
  "debts",
];

const Container = styled.div`
  width: 100%;
  padding: ${(props) =>
    props.isMobile ? "1vh" : "1vh 10vw 3vh calc(10vw + 60px)"};
  margin: 0 auto;
`;

export const ExpensesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [category, setCategory] = useState("All types");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDay = firstDay.toISOString().split("T")[0];
    const formattedLastDay = lastDay.toISOString().split("T")[0];

    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);
    setAppliedStartDate(formattedFirstDay);
    setAppliedEndDate(formattedLastDay);
  }, []);

  const handleApply = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };

  const handleNavigate = () => {
    navigate("/home/transactions");
  };

  return (
    <Container isMobile={isMobile}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <h2 className="mb-0">List of transactions</h2>
        <button
          type="button"
          onClick={handleNavigate}
          className="btn btn-secondary"
          style={{ padding: "0 1rem" }}
        >
          {"+ "}Create
        </button>
      </Box>

      <Box
        className="filter-container"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={1}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={1}
          mb={1}
        >
          <Field label="Start date">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
          <Field>
            <Button
              onClick={handleApply}
              style={{ marginTop: isMobile ? "1rem" : "2rem" }}
            >
              Apply
            </Button>
          </Field>
        </Box>
        <Box className="type-wrapper">
          <Field label="Category">
            <select
              onChange={handleSelectChange}
              className="form-select w-100 p-2 border border-secondary-subtle rounded"
              value={category}
            >
              {transactionCategories.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </Box>
      </Box>

      <Box style={{ height: "40vh", width: "100%" }}>
        <ExpenseTable
          startDate={appliedStartDate}
          endDate={appliedEndDate}
          category={category}
        />
      </Box>
    </Container>
  );
};
