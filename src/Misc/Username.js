import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Misc/Username.css';

function Username({ username, rank, linkToCf }) {
  if(rank) {
    rank = rank.split(' ').join('-');
  }
  else {
    rank = 'newbie';
  }
  const className = `Username Username-${rank}`;

  let innerContent;
  if(rank === 'legendary-grandmaster') {
    const firstLetter = username[0];
    const firstLetterClassName = `Username-first-letter-${rank}`;
    const remainingString = username.substring(1, username.length);
    innerContent = (
      <>
        <div className={firstLetterClassName}>
          {firstLetter}
        </div>
        {remainingString}
      </>
    );
  }
  else {
    innerContent = (
      <>
        {username}
      </>
    );
  }

  if(linkToCf) {
    return (
      <a className={className} href={`https://codeforces.com/profile/${username}`}
         target='_blank' rel='noopener noreferrer'>
        { innerContent }
      </a>
    );
  }
  else {
    return (
      <Link className={className} to={`/users/${username}`}>
        { innerContent }
      </Link>
    );
  }
}

export default Username;
