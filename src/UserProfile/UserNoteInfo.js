import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProblemsApi from '../Api/ProblemsApi';
import NotesApi from '../Api/NotesApi';
import Username from '../Misc/Username';

class UserNoteInfo extends Component {
  render() {
    const info = this.props.info;

    const authorUsername = info.username;
    const isAuthor = (this.props.loggedInUsername === authorUsername);

    const noteEditLink = NotesApi.getNoteEditLink(info);
    const notePublishedLink = NotesApi.getNotePublishedLink(info);

    let problemTitleLink = null;
    if(info.published) {
      problemTitleLink = notePublishedLink;
    }
    else if(isAuthor) {
      problemTitleLink = noteEditLink;
    }

    const solvedClass = ProblemsApi.getSolvedStateCssClass(info.solved);
    const publishedClass = info.published ? 'published' : 'unpublished';

    const problemDisplayName =  ProblemsApi.getProblemDisplayName(info);
    const timestamp = (new Date(info.editedTime)).toLocaleDateString();
    const noteTitle = this.props.mostLikedMode ? ' - ' + info.title : info.title;

    let problemTitleElement;
    if(problemTitleLink) {
      problemTitleElement = (
        <Link className="User-note-info-display-link" to={problemTitleLink}>
          {problemDisplayName}
        </Link>
      );
    }
    else {
      problemTitleElement = (
        <>
          {problemDisplayName}
        </>
      );
    }

    return (
      <li className={`User-note-info User-note-info-${solvedClass}`}>
        <ul className="User-note-info-links">
          {
            isAuthor &&
            <li>
              <Link className="Askd-form-link" to={noteEditLink}>
                Edit
              </Link>
            </li>
          }
          {
            info.published &&
            <li>
              <Link className="Askd-form-link" to={notePublishedLink}>
                View
              </Link>
            </li>
          }
        </ul>
        <h5>
          {
            info.published && (info.likeCount > 0) &&
            <span className="Like-dislike-score">
              <span className="icon-thumb_up_alt" />
              {info.likeCount}
            </span>
          }
          {problemTitleElement}
        </h5>
        <h6 className="User-note-info-title">
          {
            this.props.mostLikedMode &&
            <Username username={authorUsername} rank={this.props.authorRank} />
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
