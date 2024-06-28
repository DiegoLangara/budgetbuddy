import React from "react";
import '../../css/Team.css'
import luis from '../../Assets/Luis.png'

const Team = () => {
  return (
    <section id="team" className="team-section">
      <div className="container">
        <h2>Meet the Team</h2>
        <div className="row">
          {/* Repeat for each team member */}
          <div className="col-md-3">
            <div className="team-member">
              <img src={luis} alt="Team Member" />
              <h3>Luis Baptista</h3>
              <p>Project Manager & UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
