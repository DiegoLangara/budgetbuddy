import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css'

const Navbar = () => {
  return (
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
  );
};

export default Navbar;
