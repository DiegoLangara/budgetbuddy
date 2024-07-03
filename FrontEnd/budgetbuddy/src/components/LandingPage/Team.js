
import React from "react";
import '../../css/Team.css';
import luis from '../../Assets/Luis.png';
import Kyril from '../../Assets/Kyril.png';
import Bill from '../../Assets/Bill.png';
import darsh from '../../Assets/darsh.png';
import diego from '../../Assets/diego.png';
import yohei from '../../Assets/yohei.png';
import shun from '../../Assets/shun.png';
import mateo from '../../Assets/mateo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import dteam from '../../Assets/dteam.png';
import devteam from '../../Assets/devteam.png';

const Team = () => {
  return (
    <section id="team" className="team-section">
      <div className="container text-center">
        <h1>Meet the Team</h1>
        <div className="designers">
          <div className="d-flex justify-content-center align-items-center team-title">
            <img src={dteam} alt="Designers Team" className="me-3" />
            <h2>Designer Team</h2>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="team-member">
                <img src={luis} alt="Team Member" />
                <h3>Luis Baptista</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Project Manager & UI/UX Designer</p>
                  <a href="https://www.linkedin.com/in/luiscbaptistajr/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={Kyril} alt="Team Member" />
                <h3>Kyril Evangelista</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Lead Designer - UI/UX</p>
                  <a href="https://www.linkedin.com/in/kyril-louis-evangelista-303826193/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={Bill} alt="Team Member" />
                <h3>Saharat Akaradechawut</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">UI/UX Designer </p>
                  <a href="https://www.linkedin.com/in/saharatb/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={darsh} alt="Team Member" />
                <h3>Darshjot Sohi</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">UI/UX Designer </p>
                  <a href="https://www.linkedin.com/in/darshjot-kaur-sohi-18ba3b2b9/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center team-title">
            <img src={devteam} alt="Developer Team" />
            <h2>Development Team</h2>
          </div>
          <div className="row developers">
            <div className="col-md-3">
              <div className="team-member">
                <img src={diego} alt="Team Member" />
                <h3>Diego Almeida</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Lead Developer - Full Stack</p>
                  <a href="https://www.linkedin.com/in/diealm/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={mateo} alt="Team Member" />
                <h3>Mateo Buitrago</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Full Stack Developer</p>
                  <a href="https://www.linkedin.com/in/mateof-buitrago/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={yohei} alt="Team Member" />
                <h3>Yohei Tarutani</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Full Stack Developer</p>
                  <a href="https://www.linkedin.com/in/yohei-tarutani-855616272/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src={shun} alt="Team Member" />
                <h3>Shunsaku Sugita</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">Full Stack Developer</p>
                  <a href="https://www.linkedin.com/in/shunsaku-sugita-22323128b/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
