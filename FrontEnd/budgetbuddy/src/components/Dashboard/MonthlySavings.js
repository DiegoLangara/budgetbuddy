import React, { useState } from "react";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fetch savings from the backend
async function fetchSavings(user_id, token) {
  try {
    const response = await fetch(
      `URL`, //TODO Add URL
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

  // TODO Fetch savings from the backend

  const monthlySavings = [
    {
      name: "Monthly Savings",
      data: [1000, 1200, 1000, 900, 900, 800, 700, 100, 200, 500, 700, 900],
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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
