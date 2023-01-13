import React from 'react';
import TeamMember from '../components/TeamMember';
import TeamImage1 from '../resources/1.png';
import TeamImage2 from '../resources/2.png';
import TeamImage3 from '../resources/3.png';
import TeamImage4 from '../resources/4.png';

function UserCards() {
  const team = [
    {
      name: 'Amrit Kaur Ramos',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/amrit-ramos-2103a879/',
      image: TeamImage4,
    },
    {
      name: 'Arthur Huynh',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/arthurnhuynh/',
      image: TeamImage2,
    },
    {
      name: 'Dennis Cheung',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/denniskhcheung/',
      image: TeamImage3,
    },
    {
      name: 'Jason Hwang',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/jason-jh-hwang/',
      image: TeamImage1,
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
