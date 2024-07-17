import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const fetchIncomeAndDebts = async (user_id, token) => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/dashboard/incomeanddebts/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    console.error('Failed to fetch income and debts:', error);
    return [];
  }
};

export const IncomeAndDebts = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const user_id = currentUser?.id;

  const [incomeAndDebts, setIncomeAndDebts] = useState([]);

  useEffect(() => {
    if (token && user_id) {
      async function loadIncomeAndDebts() {
        const fetchedIncomeAndDebts = await fetchIncomeAndDebts(user_id, token);
        const formattedIncomeAndDebts = fetchedIncomeAndDebts.map((data) => ({
          month: data.month || '',
          income: data.income || 0,
          debts: data.debts || 0,
        }));
        setIncomeAndDebts(formattedIncomeAndDebts);
        console.log(incomeAndDebts);
      }
      loadIncomeAndDebts();
    }
  }, [token, user_id]);


  const series = [
    {
      name: 'Income',
      data: [3000, 3200, 2900, 3100, 2800, 3400, 3300, 3700, 3600, 3900, 4100, 4500] // Replace with your income data
    },
    {
      name: 'Debts',
      data: [-1200, -1100, -1400, -1300, -1500, -1600, -1700, -1800, -1900, -2000, -2100, -2200] // Replace with your debts data
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
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 1rem;
`;

const StyledTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
`;