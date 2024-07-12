import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Team.css'; // Asegúrate de ajustar la ruta según corresponda

const TeamMember = ({ photo, stream, name, linkedin, position }) => {
  return (
    <div className="col-md-3">
      <div className="team-member">
        <img src={photo} alt="Team Member" />
        <div className="justify-content-between align-items-center">
          <p className="mb-0">{stream}</p>
          <div className="d-flex justify-content-between align-items-center">
            <h3>{name}</h3>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          </div>
          <p className="mb-0">{position}</p>
        </div>
      </div>
    </div>
  );
};

TeamMember.propTypes = {
  photo: PropTypes.string.isRequired,
  stream: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default TeamMember;
