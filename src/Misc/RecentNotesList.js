import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from './LoadingSpinner';
import NotesApi from '../Api/NotesApi';
import LoadState from '../Enum/LoadState';
import UserNoteInfo from '../UserProfile/UserNoteInfo';

async function getMostRecentNotes(props, params) {
  return await NotesApi.getMostRecentNotes(1);
}

function getProblemDisplayName(platform, contestName, problemCode, problemName) {
  if(platform === 'CodeForces') {
    return `${contestName} ${problemCode} - ${problemName}`
  }
  return `${platform} - ${contestName} ${problemCode} - ${problemName}`;
}

function RecentNotesList({ otherProps, loadInfo, info, screen }) {
  const location = useLocation();
  useEffect(() => {
    loadInfo();
  }, [loadInfo, location]);

  let innerContent;
  if(screen === LoadState.LOADING) {
    innerContent = (
      <LoadingSpinner />
    );
  }
  else if(screen === LoadState.DONE) {
    let noteListItems = [];
    for(let i = 0; i < info.notes.length; i++) {
      const note = info.notes[i];
      const noteLink = UserNoteInfo.getNotePublishedLink(note);
      const displayName = getProblemDisplayName(
        note.platform, note.contestName, note.problemCode, note.problemName
      );

      noteListItems.push(
        <li key={i}>
          <Link className="Askd-form-link"
                to={`/users/${note.username}`}>
            {note.username}
          </Link>
          {` - `}
          <Link className="Askd-button Askd-button-generic" to={noteLink}>
            { displayName }
          </Link>
        </li>
      );
    }

    noteListItems.push(
      <li key="more">
        <Link className="Askd-form-link" to="/notes?recent=1">
          More...
        </Link>
      </li>
    );

    innerContent = (
      <ol className="Module-recent-notes-list">
        { noteListItems }
      </ol>
    );
  }

  return (
    <div className="Module-recent-notes">
      <h4 className="Module-heading">Recent actions</h4>
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(
  getMostRecentNotes, null, null, RecentNotesList
);
