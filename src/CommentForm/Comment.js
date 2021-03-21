import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextEditorContent from '../TextEditor/TextEditorContent';
import Utils from '../Utils';

function Comment({ info, replyUsername, subscribeToAvatar, replyCallback }) {
  const [ avatarData, setAvatarData ] = useState(null);

  useEffect(() => {
    if(subscribeToAvatar) {
      subscribeToAvatar(setAvatarData);
    }
  }, [subscribeToAvatar]);

  const id = info.commentId;
  const authorUsername = info.username;
  const timeAgoString = Utils.getTimeAgoString(info.creationTime);
  const content = JSON.parse(info.content);

  return (
    <div id={id} className="Comment-section-comment Module-outer-space">
      {
        replyUsername &&
        <span className="Comment-section-reply-username">
          <Link className="Username" to={`/users/${replyUsername}`}>
            {replyUsername}
          </Link>
          <span className="icon-reply" />
        </span>
      }
      {
        avatarData &&
        <img className="Comment-section-avatar" src={avatarData} alt="avatar" />
      }
      <div className="Comment-section-comment-body">
        <Link className="Username" to={`/users/${authorUsername}`}>
          {authorUsername}
        </Link>
        <span className="Comment-section-timestamp">
          {timeAgoString}
        </span>
        <TextEditorContent id={id + 'Z'} content={content}
                           editable={false} />
        <div className="Comment-section-comment-buttons">
          <span className="icon-thumb_up_alt" />
          <button className="Comment-section-reply-button Askd-button"
                  onClick={replyCallback}>
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default Comment;
