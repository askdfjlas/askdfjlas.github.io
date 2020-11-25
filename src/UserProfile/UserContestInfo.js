import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SolvedState from '../Api/SolvedState';

class UserContestInfo extends Component {
  render() {
    const info = this.props.info;

    let noteElements = [];
    for(let i = 0; i < info.notes.length; i++) {
      const note = info.notes[i];
      const problemCode = note.problemSk.split('#')[1];
      const problemUrl = note.problemSk.replace('#', '/');

      let codeClassName = 'User-note-contest-code';
      if(problemCode.length >= 3) {
        codeClassName += '-small';
      }

      let solvedClass;
      switch(note.solved) {
        case SolvedState.SOLVED.value:
          solvedClass = 'solved';
          break;
        case SolvedState.UPSOLVED.value:
          solvedClass = 'upsolved';
          break;
        case SolvedState.UPSOLVED_HELP.value:
          solvedClass = 'upsolved-help';
          break;
        default:
          solvedClass = 'unsolved';
      }

      noteElements.push(
        <li key={i} className={`User-note-contest-${solvedClass}`}>
          <Link className="User-note-contest-edit Askd-form-link"
                to={`/notes/edit/${info.platform}/${problemUrl}`}>
            Edit
          </Link>
          <span className={codeClassName}>
            {problemCode}
          </span>
        </li>
      );
    }

    return (
      <li className="User-note-info">
        <h5>
          {info.contestName}
        </h5>
        <ul className="User-note-contest-notes">
          { noteElements }
        </ul>
      </li>
    );
  }
}

export default UserContestInfo;
