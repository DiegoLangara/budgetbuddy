import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Footer.css';
import logo from '../../Assets/Logonn.png';
const Footer = () => {
  return (
    <footer className="footer bg-light text-center">
      <div className="container">
        <div className="firstContainer navbar-expand-lg navbar-light bg-light">
          <div className="row">
            <img src={logo} alt="logo" className="logo" />
            <h2>BudgetBuddy</h2>
          </div>
          <div className="row">
              <ul className="row">
                  <li className="nav-item">
                    <Link className="nav-link" to="#features">Features</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#team">Team</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#contact">Contact Us</Link>
                  </li>
              </ul>
          </div>  
          </div>
          <p>© 2024 MewTwo | BudgetBuddy. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
