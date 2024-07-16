import React from "react";
import "../../css/Team.css";
import luis from "../../Assets/luis.jpg";
import Kyril from "../../Assets/kyril.jpg";
import Bill from "../../Assets/bill.jpg";
import darsh from "../../Assets/darsh.jpg";
import diego from "../../Assets/diego.jpg";
import yohei from "../../Assets/yohei.jpg";
import shun from "../../Assets/shun.jpg";
import mateo from "../../Assets/mateo.jpg";
import dteam from "../../Assets/dteam.png";
import devteam from "../../Assets/devteam.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import TeamMember from './TeamMember'; // Asegúrate de ajustar la ruta según corresponda

const Team = () => {
  const designers = [
    { photo: luis, stream: 'Designer Stream', name: 'Luis Baptista', linkedin: 'https://www.linkedin.com/in/luiscbaptistajr/', position: 'PM & UI/UX Designer' },
    { photo: Kyril, stream: 'Designer Stream', name: 'Kyril Evangelista', linkedin: 'https://www.linkedin.com/in/kyril-louis-evangelista-303826193/', position: 'Lead Designer - UI/UX' },
    { photo: Bill, stream: 'Designer Stream', name: 'Saharat Akaradechawut', linkedin: 'https://www.linkedin.com/in/saharatb/', position: 'UI/UX Designer' },
    { photo: darsh, stream: 'Designer Stream', name: 'Darshjot Sohi', linkedin: 'https://www.linkedin.com/in/darshjot-kaur-sohi-18ba3b2b9/', position: 'UI/UX Designer' },
  ];

  const developers = [
    { photo: diego, stream: 'Developer Stream', name: 'Diego Almeida', linkedin: 'https://www.linkedin.com/in/diealm/', position: 'Lead Developer' },
    { photo: mateo, stream: 'Developer Stream', name: 'Mateo Buitrago', linkedin: 'https://www.linkedin.com/in/mateof-buitrago/', position: 'Full Stack Developer' },
    { photo: yohei, stream: 'Developer Stream', name: 'Yohei Tarutani', linkedin: 'https://www.linkedin.com/in/yohei-tarutani-855616272/', position: 'Full Stack Developer' },
    { photo: shun, stream: 'Developer Stream', name: 'Shunsaku Sugita', linkedin: 'https://www.linkedin.com/in/shunsaku-sugita-22323128b/', position: 'Full Stack Developer' },
  ];

  return (
    <section id="team" className="team-section">
      <div className="container text-center">
        <h1>Meet the Team</h1>
        <div className="designers">
          <div className="d-flex justify-content-center team-title">
            <img src={dteam} alt="Designers Team" className="me-3" />
            <h2>Designer Team</h2>
          </div>
          <div className="row mb-4">
            {designers.map((designer, index) => (
              <TeamMember
                key={index}
                photo={designer.photo}
                stream={designer.stream}
                name={designer.name}
                linkedin={designer.linkedin}
                position={designer.position}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center team-title">
            <img src={devteam} alt="Developer Team" />
            <h2>Development Team</h2>
          </div>
          <div className="row developers">
            {developers.map((developer, index) => (
              <TeamMember
                key={index}
                photo={developer.photo}
                stream={developer.stream}
                name={developer.name}
                linkedin={developer.linkedin}
                position={developer.position}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
