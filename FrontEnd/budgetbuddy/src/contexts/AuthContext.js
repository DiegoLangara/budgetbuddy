// contexts/AuthContext.js
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const navigate = useNavigate();

  function signup(email, password) {
    // Call API to create a user
    return fetch("https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()).then(data => {
      setCurrentUser(data.user);
      setIsFirstTime(true);
    });
  }

  async function login(email, password) {
    try {
      const response = await fetch("https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
        //dar respuesta a partir del API
      }

      const data = await response.json();
      // Assuming `isFirstTime` is determined elsewhere and stored in the localStorage for this example keep this in mind for future references users are being redirected to the onborading but this needs to be reviewed.
      const isFirstTime = localStorage.getItem(`isFirstTime_${data.user_id}`) === "true";

      setCurrentUser({ id: data.user_id, token: data.token });
      setIsFirstTime(isFirstTime);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to log in");
      //dar respuesta a partir del API
    }
  }

  function logout() {
    return fetch("/api/logout", {
      method: "POST"
    }).then(() => {
      setCurrentUser(null);
      navigate("/login");
    });
  }

  function resetPassword(email) {
    return fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
  }

  useEffect(() => {
    fetch("").then(res => res.json()).then(data => {
      setCurrentUser(data.user);
      setIsFirstTime(data.user.isFirstTime);
    });
  }, []);

  const value = {
    currentUser,
    isFirstTime,
    login,
    signup,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContext;
