import React from 'react';
import TeamMember from '../components/TeamMember';

function UserCards() {
  const team = [
    {
      name: 'Amrit Kaur Ramos',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/amrit-ramos-2103a879/',
      image: 'url image here',
    },
    {
      name: 'Arthur Huynh',
      title: 'Software Engineer',
      linkedIn: 'www.linkedin.com/in/arthurnhuynh',
      image: 'url image here',
    },
    {
      name: 'Dennis Cheung',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/denniskhcheung/',
      image: 'url image here',
    },
    {
      name: 'Jason Hwang',
      title: 'Software Engineer',
      linkedIn: 'www.linkedin.com/in/jason-jh-hwang',
      image: 'url image here',
    },
  ];

  let fullTeam = [];

  for (let i = 0; i < team.length; i++) {
    <UserCards
      name={team[i].name}
      title={team[i].title}
      linkedIn={team[i].linkedIn}
      image={team[i].image}
    />;
  }

  return <div>{fullTeam}</div>;
}

export default UserCards;
