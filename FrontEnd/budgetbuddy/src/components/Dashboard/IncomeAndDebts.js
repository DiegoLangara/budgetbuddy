import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const fetchedIncome = async (user_id, token) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/balance/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
          user_id: user_id,
          type: 'income',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch income:', error);
    return [];
  }
};

const fetchedDebts = async (user_id, token) => {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/balance/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
          user_id: user_id,
          type: 'debts',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch debts:', error);
    return [];
  }
};

export const IncomeAndDebts = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [income, setIncome] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const loadIncomeAndDebts = async () => {
      if (user_id && token) {
        const incomeData = await fetchedIncome(user_id, token);
        const debtsData = await fetchedDebts(user_id, token);
        setIncome(incomeData.balance);
        setDebts(debtsData.balance);
      }
    };
    loadIncomeAndDebts();
  }, [user_id, token]);

  const series = [
    {
      name: 'Income',
      data: [income]
    },
    {
      name: 'Debts',
      data: [-debts]
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 440,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['#22AB94', '#F23645'],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    yaxis: {
      stepSize: 1
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (val) {
          return val;
        }
      },
      y: {
        formatter: function (val) {
          return "$" + Math.abs(val);
        }
      }
    },
    xaxis: {
      categories: ['Total'
      ],
      labels: {
        formatter: function (val) {
          return Math.abs(val);
        }
      }
    },
  };

  return (
    <StyledWrapper>
      <StyledTitle>Income and Debts</StyledTitle>
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;

const StyledTitle = styled.h4`
  font-weight: bold;
`;