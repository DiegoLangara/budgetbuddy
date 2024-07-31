import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from "../../contexts/AuthContext";

const BalanceContext = createContext();

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const { currentUser } = useAuth();
  
  const fetchBalance = async () => {
    if (currentUser) {
      const response = await fetch(
        "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/balance/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: currentUser.token,
            user_id: currentUser.id,
            type: "income",
          },
        }
      );
      const data = await response.json();
      setBalance(data.balance);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBalance();
    }
  }, [currentUser]);

  return [balance, fetchBalance];
};

export const BalanceProvider = ({ children }) => {
  const balanceValue = useBalance();

  return (
    <BalanceContext.Provider value={balanceValue}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalanceContext = () => {
  return useContext(BalanceContext);
};
