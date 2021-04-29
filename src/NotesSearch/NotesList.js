import React from 'react';
import NotesApi from '../Api/NotesApi';
import UserAuthApi from '../Api/UserAuthApi';
import UserNoteInfo from '../UserProfile/UserNoteInfo';
import Paginator from '../Paginator/Paginator';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import LoadState from '../Enum/LoadState';

async function getMostLikedNotes(props, params) {
  const username = props.username;
  const platform = props.platform;
  const contestId = props.contestId;
  const problemId = props.problemId;
  const page = props.page;
  const sortByRecent = props.sortByRecent;

  let data;
  if(sortByRecent) {
    data = await NotesApi.getMostRecentNotes(page);
  }
  else {
    data = await NotesApi.getMostLikedNotes(
      username, platform, contestId, problemId, page
    );
  }
  const loggedInUsername = await UserAuthApi.getUsername();

  return {
    ...data,
    loggedInUsername: loggedInUsername
  };
}

function NotesList({ otherProps, info, screen }) {
  let innerContent;
  if(screen === LoadState.NOT_FOUND) {
    innerContent = (
      <h3 className="Not-found-text">
        Page not found!
      </h3>
    );
  }
  else if(screen === LoadState.LOADING) {
    innerContent = (
      <LoadingSpinner />
    );
  }
  else {
    const paginator = (
      <Paginator currentPage={otherProps.page} totalPages={info.totalPages}
                 callback={otherProps.pageChangeCallback} />
    );

    let noteInfoElements = [];
    for(let i = 0; i < info.notes.length; i++) {
      const note = info.notes[i];
      const authorRank = info.userRanks[note.username];

      noteInfoElements.push(
        <UserNoteInfo key={i} info={note} mostLikedMode={true}
                      authorRank={authorRank}
                      loggedInUsername={info.loggedInUsername} />
      );
    }

    if(noteInfoElements.length === 0) {
      innerContent = (
        <p className="User-notes-nothing">
          There are no published notes for that search!
        </p>
      );
    }
    else {
      innerContent = (
        <>
          { paginator }
          <ul className="User-notes-list">
            { noteInfoElements }
          </ul>
          { paginator }
        </>
      );
    }
  }

  return (
    <div className="User-notes Module-space">
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(
  getMostLikedNotes, null, 'PageNotFound', NotesList
);
