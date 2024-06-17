import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Welcome to Budget Buddy</h1>
        <p>Your personal finance management assistant</p>
        <Link to="/login">
          <button className="btn btn-primary">Get Started</button>
        </Link>
      </header>
      {/* Add sections as needed */}
    </div>
  );
};

export default HomePage;
