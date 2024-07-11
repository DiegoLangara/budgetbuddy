import React, { useState, useEffect } from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

// Fetch savings from the backend
async function fetchSavings(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/dashboard/monthlysavings/`,
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
    console.log(data)
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

  useEffect(() => {
    if (token && user_id) {
      async function loadSavings() {
        const fetchedSavings = await fetchSavings(user_id, token);
        const formattedSavings = fetchedSavings.map((saving) => ({
          month: saving.month || "",
          total_savings: saving.total_savings || 0,
        }));
        setSavings(formattedSavings);
        console.log(savings)
      }
      loadSavings();
    }
  }, [token, user_id]);

  const months = savings.map((data) => data.month);
  const monthlySavings = [
    {
      name: "Total Savings",
      data: savings.map((data) => data.total_savings),
    },
  ];

  const options = {
    dataLabels: {
      enabled: false
    },
    chart: {
      toolbar: {
        show: true,
      },
      redrawOnParentResize: true,
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
    colors: ["#F23645"],
  };

  return (
    <StyledMonthlySavings>
      <h3>Monthly Savings</h3>
      <ApexChart options={options} series={monthlySavings} type="area" />
    </StyledMonthlySavings>
  );
};

const StyledMonthlySavings = styled.div`
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;
