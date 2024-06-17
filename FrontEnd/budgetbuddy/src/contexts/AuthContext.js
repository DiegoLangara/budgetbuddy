import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  function signup(email, password) {
    // Call API to create a user
    return fetch("https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/register", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json"
      },  
      body: JSON.stringify({ email, password })
    }).then(res => res.json()).then(data => {
      setCurrentUser(data.user);
    });
  }

  function login(email, password) {
    // Call API to login
    return fetch("https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/auth", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()).then(data => {
      setCurrentUser(data.user);
      navigate("/");
    });
  }

  function logout() {
    // Call API to logout
    return fetch("/api/logout", {
      method: "POST"
    }).then(() => {
      setCurrentUser(null);
      navigate("/login");
    });
  }

  function resetPassword(email) {
    // Call API to reset password
    return fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
  }

  useEffect(() => {
    // Check if the user is logged in on component mount
    fetch("").then(res => res.json()).then(data => {
      setCurrentUser(data.user);
    });
  }, []);

  const value = {
    currentUser,
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