import React from 'react';
import { ReactComponent as Linkedin } from '../resources/linkedin-icon.svg';

function TeamMember(props) {
  const { name, title, linkedIn, image } = props;

  return (
    <div className="member-card">
      <img src={image} alt={`Image of ${name}`} className="member-pic" />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <h3>
        <a href={linkedIn} target="_blank" rel="noreferrer noopener">
          <Linkedin className="linkedin-icon" />
        </a>
      </h3>
    </div>
  );
}

export default TeamMember;
