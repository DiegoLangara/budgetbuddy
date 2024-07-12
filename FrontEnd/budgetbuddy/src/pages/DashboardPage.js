import React, { useState, useEffect } from "react";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";
import { Box } from "@mui/system";
import { Field } from "../components/OnboardingParts/Field";
import { Input } from "../components/OnboardingParts/Input";
import { Button } from "react-bootstrap";

export const DashboardPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDay = firstDay.toISOString().split('T')[0];
    const formattedLastDay = lastDay.toISOString().split('T')[0];

    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);
    setAppliedStartDate(formattedFirstDay);
    setAppliedEndDate(formattedLastDay);
  }, []);

  const handleApply = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} style={{ width: "100%", padding: "1vh 10vw 3vh calc(10vw + 60px)", margin: "0 auto" }}>
      <Box display="flex" alignItems="stretch" gap={1}>
        <Field label="Start date">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End date">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
        <Field>
          <Button onClick={handleApply} style={{ marginTop: "2rem" }}>Apply</Button>
        </Field>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Goals startDate={appliedStartDate} endDate={appliedEndDate} />
      </Box>

      <Box display="flex" alignItems="stretch" gap={2}>
        <Box sx={{ width: '50%' }}>
          <BalanceOfBudgetAndExpenses startDate={appliedStartDate} endDate={appliedEndDate} />
        </Box>

        <Box sx={{ width: '50%' }}>
          <MonthlyTotalExpenses startDate={appliedStartDate} endDate={appliedEndDate} />
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <Box sx={{ width: '50%' }}>
          <ExpendituresByCategory startDate={appliedStartDate} endDate={appliedEndDate} />
        </Box>
        <Box sx={{ width: '50%' }}>
          <MonthlySavings startDate={appliedStartDate} endDate={appliedEndDate} />
        </Box>
      </Box>
    </Box>
  );
};
