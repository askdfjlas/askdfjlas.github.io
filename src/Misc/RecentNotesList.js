import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from './LoadingSpinner';
import NotesApi from '../Api/NotesApi';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

async function getMostRecentNotes(props, params) {
  return await NotesApi.getMostRecentNotes(1);
}

function RecentNotesList({ otherProps, loadInfo, info, screen }) {
  const location = useLocation();
  useEffect(() => {
    loadInfo();
  }, [loadInfo, location]);

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

      noteListItems.push(
        <li key={i}>
          <Link className="Username"
                to={`/users/${note.username}`}>
            {note.username}
          </Link>
          {' '}
          <span className="icon-long-arrow-right" />
          {' '}
          <Link className="Askd-form-link" to={noteLink}>
            {displayName}
          </Link>
          {' '}
          <span className="icon-note-text" />
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
      <ol>
        { noteListItems }
      </ol>
    );
  }

  return (
    <div className="Module-recent-notes">
      <div className="Module-recent-actions">
        <h4>Recent actions</h4>
      </div>
      <div className="Module-recent-notes-divider" />
      <SimpleBar className="Module-recent-notes-list">
        { innerContent }
      </SimpleBar>
    </div>
  );
}

export default CreateLoadingComponent(
  getMostRecentNotes, null, null, RecentNotesList
);
