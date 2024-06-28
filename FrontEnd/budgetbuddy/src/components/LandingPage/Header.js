
import React from "react";
import Navbar from "./Navbar";
import "../../css/Header.css";


const Header = () => {
  return (
    <header className="landing-header text-center">

      <Navbar />
      <div className="header-content">
        <h2>Welcome to </h2>
        <h1>Budget Buddy</h1>

        <p>A platform for effortlessly tracking, saving, managing expenses and achieving your financial goals.</p>
      </div>
    </header>
  );
};

export default Header;
