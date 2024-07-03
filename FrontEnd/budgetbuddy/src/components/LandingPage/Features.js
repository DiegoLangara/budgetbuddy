
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Features.css';
import incomeReport from '../../Assets/iphoneLayer.png';
import ExpensesReport from '../../Assets/BudgetManagement.png';
import Goal from '../../Assets/Goal.png';


const Features = () => {
  return (
    <section id="features" className="features-section text-center">
      <div className="container">

        <div className="section-heading">
          <h2>Features</h2>
        </div>
        <div className="feature-row">
          <div className="feature-item">
            <div className="feature-content feature-content-1">
              <h3>Track Expenses</h3>
              <p>Effortlessly track your expenses on-the-go so you can manage them effectively.</p>
            </div>
            <div className="feature-image">
              <img src={incomeReport} alt="Track Expenses" />
            </div>
          </div>
          <div className="feature-item reverse">
            <div className="feature-content feature-content-2">
              <h3>Budget Management</h3>
              <p>Effectively manage your budget and expenses and get proper insights.</p>
            </div>
            <div className="feature-image feature-image-2">
              <img src={ExpensesReport} alt="Budget Management" />
            </div>
          </div>
        </div>
        <div className="row feature-row">
          <div className="feature-item">
            <div className="feature-content feature-content-3">
              <h3>Goal Management</h3>
              <p>Easily set up, manage and achieve your financial goals.</p>
            </div>
            <div className="feature-image feature-image-3">
              <img src={Goal} alt="Goal Management" />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
