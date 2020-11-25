import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SolvedState from '../Api/SolvedState';

class UserNoteInfo extends Component {
  render() {
    const info = this.props.info;

    let solvedClass;
    switch(info.solved) {
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

    const problemUrl = info.problemSk.replace('#', '/');
    const publishedClass = info.published ? 'published' : 'unpublished';

    return (
      <li className={`User-note-info User-note-info-${solvedClass}`}>
        <Link className="User-note-info-edit Askd-form-link"
              to={`/notes/edit/${info.platform}/${problemUrl}`}>
          Edit
        </Link>
        <h5>
          {info.platform} {info.problemCode} - {info.problemName}
        </h5>
        <h6 className="User-note-info-title">
          {info.title}
        </h6>
        <ul className="User-note-info-tags">
          <li className="User-note-solved-indicator" />
          <li className={`User-note-tag-${publishedClass}`} />
        </ul>
      </li>
    );
  }
}

export default UserNoteInfo;
