import React, { useState, useEffect } from 'react';
import HomePost from './HomePost';
import UserAuthApi from '../Api/UserAuthApi';
import Utils from '../Utils';
import homeNews from './homeNews';
import '../css/CpNotes.css';

function CpNotes() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const username = await UserAuthApi.getUsername();
      if(username) {
        setIsLoggedIn(true);
      }
    };
    checkLoggedIn();

    if(window.loginTasks) {
      window.loginTasks.push(checkLoggedIn);
    }
    else {
      window.loginTasks = [checkLoggedIn];
    }

    return () => {
      for(let i = 0; i < window.loginTasks.length; i++) {
        if(window.loginTasks[i] === checkLoggedIn) {
          window.loginTasks.splice(i, 1);
          break;
        }
      }
    }
  }, []);

  let innerContent = [];
  for(let i = 0; i < homeNews.length; i++) {
    if(homeNews[i].betaOnly && Utils.whatStageIsThis() !== 'beta') continue;
    if(homeNews[i].prodOnly && Utils.whatStageIsThis() !== 'prod') continue;
    if(homeNews[i].loggedInOnly && !isLoggedIn) continue;

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
