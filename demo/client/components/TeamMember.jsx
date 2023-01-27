import React from 'react';
import { ReactComponent as Linkedin } from '../resources/icons/linkedin-icon.svg';
import { ReactComponent as GitHub } from '../resources/icons/githubIcon.svg';

function TeamMember(props) {
  const { name, title, linkedIn, image, GitHubLink } = props;

  return (
    <div className='member-card'>
      <img src={image} alt={`Image of ${name}`} className='member-pic' />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <div className='icons-container'>
        <div>
          <a href={linkedIn} target='_blank' rel='noreferrer noopener'>
            <Linkedin className='linkedin-icon' />
          </a>
        </div>
        <div>
          <a href={GitHubLink} target='_blank' rel='noreferrer noopener'>
            <GitHub className='github-icon' />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TeamMember;
