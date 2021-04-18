import React from 'react';
import HomePost from './HomePost';
import homeNews from './homeNews';
import '../css/CpNotes.css';

function CpNotes() {
  let innerContent = [];
  for(let i = 0; i < homeNews.length; i++) {
    innerContent.push(
      <li className="Module-outer-space Cp-notes-home-post" key={i}>
        <HomePost info={homeNews[i]} />
      </li>
    )
  }

  return (
    <ol className="Cp-notes-home-list">
      { innerContent }
    </ol>
  );
}

export default CpNotes;
