import React from "react";
import { Goals } from "../components/Dashboard/Goals";
import { BalanceOfBudgetAndExpenses } from "../components/Dashboard/BalanceOfBudgetAndExpenses";
import { MonthlyTotalExpenses } from "../components/Dashboard/MonthlyTotalExpenses";
import { ExpendituresByCategory } from "../components/Dashboard/ExpendituresByCategory";
import { MonthlySavings } from "../components/Dashboard/MonthlySavings";
import { Box } from "@mui/system";

export const DashboardPage = () => {

  return (
    <Box display="flex" flexDirection="column" gap={2} style={{ width: "100%", padding: "1vh 10vw 3vh calc(10vw + 60px)", margin: "0 auto" }}>

      <Box sx={{ width: '100%' }}>
        <Goals />
      </Box>

      <Box display="flex" alignItems="stretch" gap={2}>
        <Box sx={{ width: '50%' }}>
          <BalanceOfBudgetAndExpenses />
        </Box>

        <Box sx={{ width: '50%' }}>
          <MonthlyTotalExpenses />
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <Box sx={{ width: '50%' }}>
          <ExpendituresByCategory />
        </Box>
        <Box sx={{ width: '50%' }}>
          <MonthlySavings />
        </Box>
      </Box>
    </Box>
  );
};
