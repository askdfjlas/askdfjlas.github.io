import React, { useState } from 'react';
import UserAuthApi from '../Api/UserAuthApi';
import '../css/LikeDislike.css';

function LikeDislike({ initialScore, initialStatus, likeCallback }) {
  let [ score, setScore ] = useState(initialScore);
  let [ status, setStatus ] = useState(initialStatus);

  let likeButtonClass = 'Like-button';
  if(status > 0) {
    likeButtonClass += ' Like-button-liked';
  }

  let toggleStatus = async () => {
    const username = await UserAuthApi.getUsername();
    if(!username) {
      window.suggestUserRegister();
      return;
    }

    if(status > 0) {
      setStatus(0);
      setScore(score - 1);
      likeCallback(0);
    }
    else {
      setStatus(1);
      setScore(score + 1);
      likeCallback(1);
    }
  };

  return (
    <div className="Like-dislike">
      <button className={likeButtonClass} onClick={toggleStatus}>
        I like this! <span className="Like-dislike-score">+{score}</span>
      </button>
    </div>
  );
}

export default LikeDislike;
