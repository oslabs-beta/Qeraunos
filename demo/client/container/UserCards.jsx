import React from 'react';
import TeamMember from '../components/TeamMember';
import ArthurHuynh from '../resources/ArthurHuynh.jpg';
import DennisCheung from '../resources/DennisCheung.jpg';
import JasonHwang from '../resources/JasonHwang.jpg';
import AmritRamos from '../resources/AmritRamos.jpg';

function UserCards() {
  const team = [
    {
      name: 'Amrit Kaur Ramos',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/amrit-ramos-2103a879/',
      image: AmritRamos,
    },
    {
      name: 'Arthur Huynh',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/arthurnhuynh/',
      image: ArthurHuynh,
    },
    {
      name: 'Dennis Cheung',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/denniskhcheung/',
      image: DennisCheung,
    },
    {
      name: 'Jason Hwang',
      title: 'Software Engineer',
      linkedIn: 'https://www.linkedin.com/in/jason-jh-hwang/',
      image: JasonHwang,
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
