import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <header className="landing-header text-center">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">BudgetBuddy</Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="#features">Features</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#team">Team</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-success text-white" to="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="header-content">
        <h1>Welcome to Budget Buddy</h1>
        <p>A platform for effortlessly tracking, saving, managing expenses and achieving your financial goals.</p>
      </div>
    </header>
  );
};

export default Header;
