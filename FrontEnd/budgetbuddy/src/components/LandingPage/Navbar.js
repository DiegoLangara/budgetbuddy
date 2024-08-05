import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import logo from '../../Assets/Logonn.png';
import { FaFolder, FaUser, FaShoppingBag, FaHome  } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close the mobile menu after clicking a link
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false); // Close the mobile menu after clicking a link
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
            <li className="nav-item d-lg-none">
              <a className="nav-link" href="#home" onClick={scrollToTop}><FaHome className="nav-icon" /> Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features" onClick={() => scrollToSection('features')}>Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#team" onClick={() => scrollToSection('team')}>Team</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#contact" onClick={() => scrollToSection('contact')}>Contact Us</a>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="nav-link btn btn-primary text-white" to="/login">Log In</Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="nav-link btn btn-success text-black" to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>&times;</button>
        <ul className="mobile-nav">
          <li className="nav-item">
            <a className="nav-link" href="#home" onClick={scrollToTop}>
              <FaHome className="nav-icon" /> Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#features" onClick={() => scrollToSection('features')}>
              <FaFolder className="nav-icon" /> Features
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#team" onClick={() => scrollToSection('team')}>
              <FaUser className="nav-icon" /> Team
            </a>
          </li>
          <li className="nav-item">
              <a className="nav-link" href="https://drive.google.com/file/d/1MH77n_kgjjLJ5X5eJzlX0ua73PCHTzto/view?usp=sharing" target="_blank">
             
              <FontAwesomeIcon icon={faFileArrowDown} className="nav-icon" />  Download Proposal</a>
              
            </li>
          <li className="nav-item">
            <a className="nav-link" href="#contact" onClick={() => scrollToSection('contact')}>
              <FaShoppingBag className="nav-icon" /> Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
