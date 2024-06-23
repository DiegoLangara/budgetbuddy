import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Team = () => {
  return (
    <section id="team" className="team-section text-center">
      <div className="container">
        <h2>Meet the Team</h2>
        <div className="row">
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
  );
};

export default Team;
