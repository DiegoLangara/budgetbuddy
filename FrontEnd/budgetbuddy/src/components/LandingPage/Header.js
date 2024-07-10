import React from "react";
import Navbar from "./Navbar";
import "../../css/Header.css";

const Header = () => {
  return (
    <header className="landing-header text-center">
      <Navbar />
      <div className="header-content">
        <h1 className="header-title">Easily manage your finances with us.</h1>
        <p>Effortlessly track, manage expenses and achieve financial goals for you or your company.</p>
        <a href="/signup" className="btn btn-primary download-btn">Download PDF Proposal</a>
        <div className="mobile-buttons">
          <a href="/login" className="btn btn-primary text-white">Log In</a>
          <a href="/signup" className="btn btn-success text-black">Sign Up</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
