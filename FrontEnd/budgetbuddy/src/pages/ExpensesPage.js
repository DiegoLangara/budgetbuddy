import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { Box } from "@mui/system";
import { Field } from "../components/OnboardingParts/Field";
import { Input } from "../components/OnboardingParts/Input";
import { Button } from "react-bootstrap";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

export const ExpensesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

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

  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 8,
    maxColumns: 6,
  });

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
        <button type="button" className="btn btn-secondary pl-4 pr-4">
          {"+ "}Create
        </button>
      </div>

      <Box display="flex" alignItems="stretch" gap={1}>
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
          <Button onClick={handleApply} style={{ marginTop: "2rem" }}>
            Apply
          </Button>
        </Field>
      </Box>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          {...data}
          loading={loading}
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "lightblue",
            },
          }}
        />
      </div>
    </div>
  );
};
