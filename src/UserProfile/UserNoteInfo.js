import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProblemsApi from '../Api/ProblemsApi';

class UserNoteInfo extends Component {
  render() {
    const info = this.props.info;

    const solvedClass = ProblemsApi.getSolvedStateCssClass(info.solved);
    const problemUrl = info.problemSk.replace('#', '/');
    const publishedClass = info.published ? 'published' : 'unpublished';
    const timestamp = (new Date(info.editedTime)).toLocaleDateString();
    const authorUsername = info.username;
    const profileLink = `/users/${authorUsername}`;
    const noteTitle = this.props.mostLikedMode ? ' - ' + info.title : info.title;

    return (
      <li className={`User-note-info User-note-info-${solvedClass}`}>
        <ul className="User-note-info-links">
          {
            this.props.loggedInUsername === authorUsername &&
            <li>
              <Link className="Askd-form-link"
                    to={`/notes/edit/${info.platform}/${problemUrl}`}>
                Edit
              </Link>
            </li>
          }
          {
            info.published &&
            <li>
              <Link className="Askd-form-link"
                    to={`/notes/${authorUsername}/${info.platform}/${problemUrl}`}>
                View
              </Link>
            </li>
          }
        </ul>
        <h5>
          {
            (info.published && info.likeCount) > 0 &&
            <span className="Like-dislike-score">
              +{info.likeCount}
            </span>
          }
          {info.platform} {info.problemCode} - {info.problemName}
        </h5>
        <h6 className="User-note-info-title">
          {
            this.props.mostLikedMode &&
            <Link className="Askd-form-link" to={profileLink}>
              {authorUsername}
            </Link>
          }
          {noteTitle}
        </h6>
        <h6 className="User-note-info-timestamp">
          {timestamp}
        </h6>
        <ul className="User-note-info-tags">
          <li className="User-note-info-tag User-note-solved-indicator" />
          <li className={`User-note-info-tag User-note-tag-${publishedClass}`} />
        </ul>
      </li>
    );
  }
}

export default UserNoteInfo;
