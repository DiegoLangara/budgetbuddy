import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
    const loadIncomeAndDebts = async () => {
      if (user_id && token) {
        const incomeData = await fetchedIncome(user_id, token);
        const debtsData = await fetchedDebts(user_id, token);
        setIncome(
          incomeData.balance === null ? 0 : incomeData.balance
        );
        setDebts(
          debtsData.balance === null ? 0 : debtsData.balance
        );
      }
    };
    loadIncomeAndDebts();
  }, [user_id, token]);

  let noDataCheckFlag = income === 0 && debts === 0 ? true : false;

  const handleNavigate = () => {
    navigate("/home/budget/incomes-bm");
  };

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
      <StyledTitle>Incomes and Debts</StyledTitle>
      {noDataCheckFlag ? (
        <StyledNoDataWrapper>
          <StyledNoDataMessage>No Incomes and Debts.</StyledNoDataMessage>
          <StyledNoDataMessage>Let's create new transaction.</StyledNoDataMessage>
          <StyledButton
            type="button"
            onClick={handleNavigate}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 1rem" }}
          >
            {"+ "}Create Incomes
          </StyledButton>
        </StyledNoDataWrapper>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      )
      }
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