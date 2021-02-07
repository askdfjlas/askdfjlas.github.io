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

  const data = await NotesApi.getMostLikedNotes(
    username, platform, contestId, problemId, page
  );
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
      <p className="User-notes-nothing">
        Page not found!
      </p>
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
      noteInfoElements.push(
        <UserNoteInfo key={i} info={info.notes[i]} mostLikedMode={true}
                      loggedInUsername={info.loggedInUsername}  />
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
