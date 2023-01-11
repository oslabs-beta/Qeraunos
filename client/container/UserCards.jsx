import React from 'react';
import TeamMember from '../components/TeamMember';
import placeholder from '../resources/team-placeholder.jpg';

function UserCards() {
  const team = [
    {
      name: 'Amrit Kaur Ramos',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/amrit-ramos-2103a879/',
      image: placeholder,
    },
    {
      name: 'Arthur Huynh',
      title: 'Software Engineer',
      linkedIn: 'www.linkedin.com/in/arthurnhuynh',
      image: placeholder,
    },
    {
      name: 'Dennis Cheung',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/denniskhcheung/',
      image: placeholder,
    },
    {
      name: 'Jason Hwang',
      title: 'Software Engineer',
      linkedIn: 'www.linkedin.com/in/jason-jh-hwang',
      image: placeholder,
    },
  ];

  const fullTeam = [];

  for (let i = 0; i < team.length; i++) {
    const member = (
      <TeamMember
        key={team[i].name}
        name={team[i].name}
        title={team[i].title}
        linkedIn={team[i].linkedIn}
        image={team[i].image}
      />
    );
    fullTeam.push(member);
  }

  return <div className="team">{fullTeam}</div>;
}

export default UserCards;
