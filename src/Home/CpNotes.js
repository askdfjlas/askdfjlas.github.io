import React from 'react';
import HomePost from './HomePost';
import Utils from '../Utils';
import homeNews from './homeNews';
import '../css/CpNotes.css';

function CpNotes() {
  let innerContent = [];
  for(let i = 0; i < homeNews.length; i++) {
    if(homeNews[i].betaOnly && Utils.whatStageIsThis() !== 'beta') continue;
    if(homeNews[i].prodOnly && Utils.whatStageIsThis() !== 'prod') continue;

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
