
import React from "react";
import Navbar from "./Navbar";
import "../../css/Header.css";


const Header = () => {
  return (
    <header className="landing-header text-center">

      <Navbar />
      <div className="header-content">
        <h1>Easily manage your finances with us.</h1>
        <p>Effortlessly track, manage expenses and achieve financial goals for you or your company.</p>
        <a href="/signup" className="btn btn-primary">Download PDF Proposal</a>

      </div>
    </header>
  );
};

export default Header;
