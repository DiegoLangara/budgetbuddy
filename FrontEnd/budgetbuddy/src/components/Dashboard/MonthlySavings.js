import React, { useState, useEffect } from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Fetch savings from the backend
async function fetchSavings(user_id, token) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_HOST+`/api/dashboard/monthlysavings/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch savings:", error);
    return [];
  }
}

export const MonthlySavings = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [savings, setSavings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (token && user_id) {
      async function loadSavings() {
        const fetchedSavings = await fetchSavings(user_id, token);
        const formattedSavings = fetchedSavings.map((saving) => ({
          month: saving.month || "",
          total_savings: saving.total_savings || 0,
        }));
        setSavings(formattedSavings);
      }
      loadSavings();
    }
  }, [token, user_id]);

  const months = savings.map((data) => data.month);
  const monthlySavings = [
    {
      name: "Total Savings",
      data: savings.map((data) => data.total_savings || 0),
    },
  ];

  const chkTotalSavings = monthlySavings[0].data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  let noDataCheckFlag = chkTotalSavings === 0 ? true : false;

  const handleNavigate = () => {
    navigate("/home/transactions");
  };

  const options = {
    dataLabels: {
      enabled: false
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: months
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    colors: ["#22AB94"],
    stroke: {
      curve: 'straight',
    }
  };

  return (
    <StyledMonthlySavings>
      <StyledTitle>Monthly Savings</StyledTitle>
      {noDataCheckFlag ? (
        <StyledNoDataWrapper>
          <StyledNoDataMessage>No Savings.</StyledNoDataMessage>
          <StyledNoDataMessage>Let's create new savings.</StyledNoDataMessage>
          <StyledButton
            type="button"
            onClick={handleNavigate}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 1rem" }}
          >
            {"+ "}Create transactions
          </StyledButton>
        </StyledNoDataWrapper>) : (
        < ApexChart options={options} series={monthlySavings} type="area" />
      )}
    </StyledMonthlySavings>
  );
};

const StyledMonthlySavings = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;

const StyledTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StyledNoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const StyledNoDataMessage = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0;
`;

const StyledButton = styled.button`
  margin-top: 1rem;
`;
