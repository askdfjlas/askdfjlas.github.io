import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProblemsApi from '../Api/ProblemsApi';

class UserContestInfo extends Component {
  render() {
    const info = this.props.info;

    let noteElements = [];
    for(let i = 0; i < info.notes.length; i++) {
      const note = info.notes[i];
      const problemLetter = ProblemsApi.getProblemLetter(note);
      const problemUrl = note.problemSk.replace('#', '/');
      const authorUsername = note.username;

      let codeClassName = 'User-note-contest-code';
      if(problemLetter.length >= 3) {
        codeClassName += '-small';
      }

      const solvedClass = ProblemsApi.getSolvedStateCssClass(note.solved);

      noteElements.push(
        <li key={i} className={`User-note-contest-note User-note-contest-${solvedClass}`}>
          <ul className="User-note-contest-links">
            {
              this.props.loggedInUsername === authorUsername &&
              <li>
                <Link className="Askd-form-link"
                      to={`/notes/edit/${note.platform}/${problemUrl}`}>
                  Edit
                </Link>
              </li>
            }
            {
              note.published &&
              <li>
                <Link className="Askd-form-link"
                      to={`/notes/${authorUsername}/${note.platform}/${problemUrl}`}>
                  View
                </Link>
              </li>
            }
          </ul>
          <span className={codeClassName}>
            {problemLetter}
          </span>
        </li>
      );
    }

    const contestDisplayName = ProblemsApi.getContestDisplayName(info);
    const timestamp = (new Date(info.editedTime)).toLocaleDateString();

    return (
      <li className="User-note-info">
        <h5>
          {contestDisplayName}
        </h5>
        <h6 className="User-note-contest-timestamp">
          {timestamp}
        </h6>
        <ul className="User-note-contest-notes">
          { noteElements }
        </ul>
      </li>
    );
  }
}

export default UserContestInfo;
