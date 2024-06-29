import React from "react";
import '../../css/Team.css'
import luis from '../../Assets/Luis.png'
import Kyril from '../../Assets/Kyril.png'
import Bill from '../../Assets/Bill.png'
import darsh from '../../Assets/darsh.png'
import diego from '../../Assets/diego.png'
import yohei from '../../Assets/yohei.png'
import shun from '../../Assets/shun.png'
import mateo from '../../Assets/mateo.png'


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
          <div className="col-md-3">
            <div className="team-member">
              <img src={Kyril} alt="Team Member" />
              <h3>Kyril Evangelista</h3>
              <p>Lead Designer - UI/UX </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={Bill} alt="Team Member" />
              <h3>Saharat AkaradechawutLuis Baptista</h3>
              <p>UI/UX Designer </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={darsh} alt="Team Member" />
              <h3>Darshjot Sohi</h3>
              <p>UI/UX Designer</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={diego} alt="Team Member" />
              <h3>Diego Almeida</h3>
              <p>Lead Developer - Full Stack </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={yohei} alt="Team Member" />
              <h3>Yohei Tarutani</h3>
              <p>Full Stack Developer </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={shun} alt="Team Member" />
              <h3>Shunsaku Sugita</h3>
              <p>Full Stack Developer </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="team-member">
              <img src={mateo} alt="Team Member" />
              <h3>Mateo Buitrago</h3>
              <p>Full Stack Developer </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
