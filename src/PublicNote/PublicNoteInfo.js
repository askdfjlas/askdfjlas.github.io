import React from 'react';
import { Link } from 'react-router-dom';
import ProblemsApi from '../Api/ProblemsApi';
import TextEditorContent from '../TextEditor/TextEditorContent';
import '../css/PublicNoteInfo.css';

function PublicNoteInfo({ info }) {
  const content = JSON.parse(info.content);
  const editedTimestamp = (new Date(info.editedTime)).toLocaleString();
  const solvedClass = ProblemsApi.getSolvedStateCssClass(info.solved);

  return (
    <div className="Public-note-info Module-space Module-padding-box">
      <h3 className="Module-space-heading">
        <span className={`Public-note-solved-tag User-note-info-${solvedClass}`}>
          <span className="User-note-info-tag User-note-solved-indicator" />
        </span>
        {info.title}
      </h3>
      <p className="Module-space-text">
        Written by <Link className="Askd-form-link" to={`/users/${info.username}`}>
          {info.username}
        </Link>
      </p>
      <div className="Askd-text-editor">
        <TextEditorContent content={content} id={null} editable={false} />
      </div>
      <p className="Module-space-text">
        Last edited on {editedTimestamp}
      </p>
    </div>
  );
}

export default PublicNoteInfo;
