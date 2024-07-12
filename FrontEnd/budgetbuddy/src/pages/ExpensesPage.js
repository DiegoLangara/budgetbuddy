import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Field } from "../components/OnboardingParts/Field";
import { Input } from "../components/OnboardingParts/Input";
import { Button } from "react-bootstrap";
import { ExpenseTable } from "../components/Expenses/ExpenseTable";
import { useNavigate } from "react-router-dom";

const transactionCategories = [
  "All types",
  "goals",
  "income",
  "budgets",
  "debts",
];

export const ExpensesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [category, setCategory] = useState("All types");
  const navigate = useNavigate();

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
    <div
      style={{
        width: "100%",
        padding: "1vh 10vw 3vh calc(10vw + 60px)",
        margin: "0 auto",
      }}
    >
      <div className="d-flex justify-content-between mb-4">
        <h2 className="mb-0">List of transactions</h2>
        <button
          type="button"
          onClick={handleNavigate}
          className="btn btn-secondary pl-3 pr-3"
        >
          {"+ "}Create
        </button>
      </div>

      <div className="d-flex filter-container">
        <Box display="flex" alignItems="stretch" gap={1} className="mb-1">
          <Field label="Start date" className="field">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="End date" className="field">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
          <Field className="field">
            <Button
              onClick={handleApply}
              style={{ marginTop: "2rem", marginRight: "2rem" }}
            >
              Apply
            </Button>
          </Field>
        </Box>
        <Box className="type-wapper">
          <Field label="Type" className="field">
            <div>
              <select
                onChange={handleSelectChange}
                className="form-select w-100 p-2 border border-secondary-subtle rounded rounded-2"
                value={category}
              >
                {transactionCategories.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </Box>
      </div>

      <div style={{ height: "40vh", width: "100%" }}>
        <ExpenseTable
          startDate={appliedStartDate}
          endDate={appliedEndDate}
          category={category}
        />
      </div>
    </div>
  );
};
