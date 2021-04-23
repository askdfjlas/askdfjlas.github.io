import React from 'react';
import { Link } from 'react-router-dom';
import ProblemsApi from '../Api/ProblemsApi';
import LikesApi from '../Api/LikesApi';
import TextEditorContent from '../TextEditor/TextEditorContent';
import LikeDislike from '../Misc/LikeDislike';
import Username from '../Misc/Username';
import '../css/PublicNoteInfo.css';

function PublicNoteInfo({ loggedInUsername, info }) {
  const content = JSON.parse(info.content);
  const editedTimestamp = (new Date(info.editedTime)).toLocaleString();
  const solvedClass = ProblemsApi.getSolvedStateCssClass(info.solved);

  const noteAuthor = info.username;
  const platform = info.platform;
  const problemId = info.problemSk;
  const problemUrl = problemId.split('#').join('/');
  const editLink = `/notes/edit/${platform}/${problemUrl}`;

  const likeCallback = async (likedStatus) => {
    await LikesApi.sendLike(
      loggedInUsername, noteAuthor, platform, problemId, likedStatus
    );
  };

  return (
    <div className="Public-note-info Module-outer-space">
      <h3 className="Module-space-heading">
        <span className={`Public-note-solved-tag User-note-info-${solvedClass}`}>
          <span className="User-note-info-tag User-note-solved-indicator" />
        </span>
        {info.title}
      </h3>
      {
        loggedInUsername === noteAuthor &&
        <Link className="Public-note-info-edit Askd-form-link" to={editLink}>
          Edit
        </Link>
      }
      <div className="Module-space-text">
        Written by <Username username={info.username} rank={info.authorCfRank} />
      </div>
      <div className="Askd-text-editor">
        <TextEditorContent content={content} id='Askd-public-note' editable={false} />
      </div>
      <p className="Module-space-text">
        Last edited on {editedTimestamp}
      </p>
      <LikeDislike initialScore={info.likeCount} initialStatus={info.likedStatus}
                   likeCallback={likeCallback} />
    </div>
  );
}

export default PublicNoteInfo;
