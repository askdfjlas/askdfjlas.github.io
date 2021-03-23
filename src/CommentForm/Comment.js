import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextEditorContent from '../TextEditor/TextEditorContent';
import DeleteMenu from '../Misc/DeleteMenu';
import Utils from '../Utils';

function Comment({ info, replyUsername, subscribeToAvatar, replyCallback,
                   deleteCallback, loggedInUsername }) {
  const [ avatarData, setAvatarData ] = useState(null);
  const [ deleteMenuOpen, setDeleteMenuOpen ] = useState(false);

  useEffect(() => {
    if(subscribeToAvatar) {
      subscribeToAvatar(setAvatarData);
    }
  }, [subscribeToAvatar]);

  const openDeleteMenu = () => {
    setDeleteMenuOpen(true);
  };

  const closeDeleteMenu = () => {
    setDeleteMenuOpen(false);
  };

  const id = info.commentId;
  const deleteComment = async () => {
    await deleteCallback(id);
  };

  const authorUsername = info.username;
  const timeAgoString = Utils.getTimeAgoString(info.creationTime);
  const textContentId = `Z${id}Z`;
  const content = info.content ? JSON.parse(info.content) : null;

  let commentClassName = 'Module-outer-space Comment-section-comment';
  if(loggedInUsername === authorUsername) {
    commentClassName += ' Comment-section-own-comment';
  }

  return (
    <div id={id} className={commentClassName}>
      { deleteMenuOpen &&
        <DeleteMenu exitCallback={closeDeleteMenu} deleteCallback={deleteComment}
                    entityName="comment" />
      }
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
        {
          content &&
          <TextEditorContent id={textContentId} content={content} editable={false} />
        }
        {
          !content &&
          <div className="Comment-section-deleted">
            This comment has been deleted
          </div>
        }
        <div className="Comment-section-comment-buttons">
          <button className="Comment-section-reply-button Askd-button"
                  onClick={replyCallback}>
            Reply
          </button>
        </div>
        {
          (loggedInUsername === authorUsername && info.content) &&
          <div className="Comment-section-personal-buttons">
            <button className="Askd-form-link" onClick={openDeleteMenu}>
              Delete
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default Comment;
