import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header Section */}
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

      {/* Features Section */}
      <section id="features" className="features-section text-center">
        <div className="container">
          <h2>Features</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-item">
                <h3>Track Expenses</h3>
                <p>Effortlessly track your expenses so that you can manage them effectively.</p>
                <img src="/FrontEnd/budgetbuddy/src/Assets/Income Report.png" alt="Track Expenses" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <h3>Budget Management</h3>
                <p>Effectively manage your budget and expenses and get proper insights.</p>
                <img src="path_to_image" alt="Budget Management" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <h3>Goal Management</h3>
                <p>Easily set up, manage and achieve your financial goals.</p>
                <img src="path_to_image" alt="Goal Management" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section text-center">
        <div className="container">
          <h2>Meet the Team</h2>
          <div className="row">
            {/* Repeat for each team member */}
            <div className="col-md-3">
              <div className="team-member">
                <img src="path_to_image" alt="Team Member" className="img-fluid rounded-circle" />
                <h3>Member Name</h3>
                <p>Role</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="contact-section text-center">
        <div className="container">
          <h2>Contact Us</h2>
          <p>Want to know more? Reach out to us!</p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-light text-center">
        <div className="container">
          <p>© 2024 MewTwo | BudgetBuddy. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
