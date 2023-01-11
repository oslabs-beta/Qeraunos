import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TeamMember(props) {
  const { name, title, linkedIn, image } = props;

  return (
    <div className="member-card">
      <img src={image} alt={`Image of ${name}`} className="member-pic" />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <h3>
        <FontAwesomeIcon icon="fa-brands fa-linkedin" />
      </h3>
    </div>
  );
}

export default TeamMember;
