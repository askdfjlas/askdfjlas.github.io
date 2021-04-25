import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import '../css/Misc/SeeOtherNotes.css';

function SeeOtherNotes({ platform, contestId, problemId, goDownOneLevel }) {
  if(goDownOneLevel) {
    if(problemId) {
      contestId = problemId.split('#')[0];
      problemId = null;
    }
    else if(contestId) {
      contestId = null;
    }
    else {
      platform = null;
    }
  }

  const notesSearchObject = {
    platform: platform,
    contestId: contestId,
    problemId: problemId
  };

  for(const key in notesSearchObject) {
    if(!notesSearchObject[key]) {
      delete notesSearchObject[key];
    }
  }

  const notesSearchQueryString = queryString.stringify(notesSearchObject);
  const otherNotesUrl = `/notes?${notesSearchQueryString}`;

  let otherNotesText;
  if(problemId) {
    otherNotesText = 'See other notes for this problem';
  }
  else if(contestId) {
    otherNotesText = 'See other notes from this contest';
  }
  else if(platform) {
    otherNotesText = 'See other notes from this platform';
  }
  else {
    otherNotesText = 'See other notes in general';
  }

  return (
    <Link className="See-other-notes Askd-button Askd-form-button"
          to={otherNotesUrl}>
      <span className="See-other-notes-arrow">&#10094;</span>
      {otherNotesText}
    </Link>
  );
}

export default SeeOtherNotes;
