import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Field } from "../components/OnboardingParts/Field";
import { Input } from "../components/OnboardingParts/Input";
import { Button } from "react-bootstrap";
import { ExpenseTable } from "../components/Expenses/ExpenseTable";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import "../css/ExpensePage.css";

const transactionCategories = [
  "All categories",
  "goals",
  "income",
  "budgets",
  "debts",
];

const Container = styled.div`
  width: 100%;
  padding: 0;
  margin: 0 auto;
`;

export const ExpensesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [category, setCategory] = useState("All categories");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const today = new Date();
   // alert(today);



// Create a new Date object for the first day of the previous month
const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);

// Set lastDay to today
const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
 
console.log('First day of previous month:', firstDay);
console.log('Last day (today):', lastDay);
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


      <div
        className="filter-container"
        

      >
        <div className="date-wrapper"
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
              className="apply-button"
              style={{
                
                paddingLeft: "1.2rem",
                paddingRight: "1.2rem",
              }}
            >
              Apply
            </Button>
          </Field>
        </div>
        <div className="type-wrapper">
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
        </div>
        <div className="action-wrapper">
        <Field>
        <button
          type="button"
          onClick={handleNavigate}
          className="btn btn-green"
    
        >
          {"+ "}Create
        </button>
        </Field>
      </div>
      </div>

      <div style={{ height: "40vh", width: "100%" }}>
        <ExpenseTable
          startDate={appliedStartDate}
          endDate={appliedEndDate}
          category={category}
        />
      </div>
    </Container>
  );
};
