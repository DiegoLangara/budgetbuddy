import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Features = () => {
  return (
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
  );
};

export default Features;
