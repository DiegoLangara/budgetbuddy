import React from "react";

const Team = () => {
  return (
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
  );
};

export default Team;
