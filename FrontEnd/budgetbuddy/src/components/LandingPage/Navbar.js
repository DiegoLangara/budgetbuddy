import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import logo from '../../Assets/Logonn.png';
import { FaFolder, FaUser, FaShoppingBag, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container d-flex align-items-center">
        <img src={logo} alt="logo" className="logo" />
        <Link className="navbar-brand budgetbuddy" to="/">BudgetBuddy</Link>
        <button className="navbar-toggler ml-auto" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
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
            <li className="nav-item d-none d-lg-block">
              <Link className="nav-link btn btn-primary text-white" to="/login">Login</Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="nav-link btn btn-success text-white" to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>&times;</button>
        <ul className="mobile-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={toggleMenu}>
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#features" onClick={toggleMenu}>
              <FaFolder className="nav-icon" /> Features
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#team" onClick={toggleMenu}>
              <FaUser className="nav-icon" /> Team
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#contact" onClick={toggleMenu}>
              <FaShoppingBag className="nav-icon" /> Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
