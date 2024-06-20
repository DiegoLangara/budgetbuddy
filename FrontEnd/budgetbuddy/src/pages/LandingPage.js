// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Budget Buddy</h1>
        <p>Your personal finance management assistant</p>
        <Link to="/login">
          <button className="btn btn-primary">Go to Login</button>
        </Link>
      </header>
      {/* Add other sections as needed */}
    </div>
  );
};

export default LandingPage;
