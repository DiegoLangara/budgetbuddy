// contexts/AuthContext.js
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  async function signup(email, password) {
    const response = await fetch(
      process.env.REACT_APP_API_HOST+"/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setCurrentUser({ id: data.user_id, token: data.token });
    }
    return data; // Return the data object for processing in Signup.js
  }

  async function login(email, password) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_HOST+"/api/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data.success === false) {
        Swal.fire({
          icon: data.message_icon,
          title: data.message_title,
          text: data.message_text,
          showConfirmButton: false,
      timer: 1200,
      width: "300px",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: data.message_icon,
          title: data.message_title,
          text: data.message_text,
          showConfirmButton: false,
      timer: 1200,
      width: "300px",
        }).then(() => {
          setCurrentUser({ id: data.user_id, token: data.token });
          data.onboarding === true
            ? navigate("/onboarding/welcome")
            : navigate("/home/dashboard");
        });
      }
    } catch (error) {
      throw new Error("Data connection error. Please try again.");
    }
  }

  function logout() {
    setCurrentUser(null);
    navigate("/login");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
