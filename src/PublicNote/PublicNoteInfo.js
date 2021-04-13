import React from 'react';
import ProblemsApi from '../Api/ProblemsApi';
import LikesApi from '../Api/LikesApi';
import UserAuthApi from '../Api/UserAuthApi';
import TextEditorContent from '../TextEditor/TextEditorContent';
import LikeDislike from '../Misc/LikeDislike';
import Username from '../Misc/Username';
import '../css/PublicNoteInfo.css';

function PublicNoteInfo({ info }) {
  const content = JSON.parse(info.content);
  const editedTimestamp = (new Date(info.editedTime)).toLocaleString();
  const solvedClass = ProblemsApi.getSolvedStateCssClass(info.solved);

  let likeCallback = async (likedStatus) => {
    const username = await UserAuthApi.getUsername();
    const noteAuthor = info.username;
    const platform = info.platform;
    const problemId = info.problemSk;

    await LikesApi.sendLike(username, noteAuthor, platform, problemId, likedStatus);
  };

  return (
    <div className="Public-note-info Module-outer-space">
      <h3 className="Module-space-heading">
        <span className={`Public-note-solved-tag User-note-info-${solvedClass}`}>
          <span className="User-note-info-tag User-note-solved-indicator" />
        </span>
        {info.title}
      </h3>
      <p className="Module-space-text">
        Written by <Username username={info.username} rank={info.authorCfRank} />
      </p>
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
