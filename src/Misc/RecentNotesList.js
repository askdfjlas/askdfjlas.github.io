import React from 'react';
import { Link } from 'react-router-dom';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from './LoadingSpinner';
import NotesApi from '../Api/NotesApi';
import Username from './Username';

async function getMostRecentNotes(props, params) {
  return await NotesApi.getMostRecentNotes(1);
}

function RecentNotesList({ otherProps, loadInfo, info, screen }) {
  let innerContent;
  if(!info) {
    innerContent = (
      <LoadingSpinner />
    );
  }
  else {
    let noteListItems = [];
    for(let i = 0; i < info.notes.length; i++) {
      const note = info.notes[i];
      const noteLink = NotesApi.getNotePublishedLink(note);
      const displayName = NotesApi.getNoteDisplayName(note);
      const commentIcon = (note.editedTime !== note.activityTime);
      const userRank = info.userRanks[note.username];

      noteListItems.push(
        <li key={i}>
          <Username username={note.username} rank={userRank} />
          {' '}
          <span className="icon-long-arrow-right" />
          {' '}
          <Link className="Askd-form-link" to={noteLink}>
            {displayName}
          </Link>
          {' '}
          { !commentIcon && <span className="icon-note-text" /> }
          { commentIcon && <span className="icon-comments" /> }
        </li>
      );
    }

    noteListItems.push(
      <li key="more">
        <Link className="Username" to="/notes?recent=1">
          More...
        </Link>
      </li>
    );

    innerContent = (
      <div className="Module-recent-notes-list">
        <ol>
          { noteListItems }
        </ol>
      </div>
    );
  }

  return (
    <div className="Module-recent-notes">
      <div className="Module-recent-actions">
        <h4>Recent actions</h4>
      </div>
      <div className="Module-recent-notes-divider" />
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(
  getMostRecentNotes, null, null, RecentNotesList
);
