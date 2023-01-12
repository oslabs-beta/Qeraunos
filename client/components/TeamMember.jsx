import React from 'react';
// import Linkedin from '../resources/linkedin-icon.svg';
import { ReactComponent as Linkedin } from '../resources/linkedin-icon.svg';

function TeamMember(props) {
  const { name, title, linkedIn, image } = props;

  return (
    <div className="member-card">
      <img src={image} alt={`Image of ${name}`} className="member-pic" />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <h3>
        <Linkedin className="linkedin-icon" />
        {/* <img src="Linkedin" alt="icon" /> */}
      </h3>
    </div>
  );
}

export default TeamMember;
