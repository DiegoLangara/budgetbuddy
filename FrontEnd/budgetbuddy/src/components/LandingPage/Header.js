import React from "react";
import Navbar from "./Navbar"; // Import the Navbar component

const Header = () => {
  return (
    <header className="landing-header text-center">
      <Navbar />
      <div className="header-content">
        <h1>Welcome to Budget Buddy</h1>
        <p>A platform for effortlessly tracking, saving, managing expenses and achieving your financial goals.</p>
      </div>
    </header>
  );
};

export default Header;
