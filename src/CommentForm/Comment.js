import React, { useState, useEffect, useRef } from 'react';
import TextEditorContent from '../TextEditor/TextEditorContent';
import DeleteMenu from '../Misc/DeleteMenu';
import CommentForm from './CommentForm';
import Username from '../Misc/Username';
import Utils from '../Utils';

function Comment({ info, replyUsername, subscribeToUserInfo,
                   subscribeToReplyInfo, replyCallback,
                   editCallback, deleteCallback, loggedInUsername }) {
  const id = info.commentId;
  const content = info.content ? JSON.parse(info.content) : null;

  const [ avatarData, setAvatarData ] = useState(null);
  const [ rank, setRank ] = useState(null);
  const [ replyRank, setReplyRank ] = useState(null);
  const [ editFormOpen, setEditFormOpen ] = useState(false);
  const [ deleteMenuOpen, setDeleteMenuOpen ] = useState(false);
  const editedContent = useRef(content);

  const setAvatarAndRank = (userInfo) => {
    setAvatarData(userInfo.avatarData);
    setRank(userInfo.cfRank);
  };

  useEffect(() => {
    if(subscribeToUserInfo) {
      subscribeToUserInfo(setAvatarAndRank);
    }
    if(subscribeToReplyInfo) {
      subscribeToReplyInfo((userInfo) => setReplyRank(userInfo.cfRank));
    }
  }, [subscribeToUserInfo, subscribeToReplyInfo]);

  const openEditForm = () => {
    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setEditFormOpen(false);
  };

  const updateEditedContent = (newContent) => {
    editedContent.current = newContent;
  };

  const submitEditedContent = async () => {
    await editCallback(id, editedContent.current);
  };

  const openDeleteMenu = () => {
    setDeleteMenuOpen(true);
  };

  const closeDeleteMenu = () => {
    setDeleteMenuOpen(false);
  };

  const deleteComment = async () => {
    await deleteCallback(id);
  };

  const authorUsername = info.username;
  const textContentId = `Z${id}Z`;

  let timeAgoString;
  if(info.editedTime) {
    timeAgoString = 'Edited ' + Utils.getTimeAgoString(info.editedTime);
  }
  else {
    timeAgoString = Utils.getTimeAgoString(info.creationTime);
  }

  let commentClassName = 'Module-outer-space Comment-section-comment';
  if(loggedInUsername === authorUsername) {
    commentClassName += ' Comment-section-own-comment';
  }

  if(editFormOpen) {
    return (
      <CommentForm cancelCallback={closeEditForm} addCallback={submitEditedContent}
                   initialContent={editedContent.current}
                   updateCallback={updateEditedContent} />
    );
  }
  else {
    return (
      <div id={id} className={commentClassName}>
        { deleteMenuOpen &&
          <DeleteMenu exitCallback={closeDeleteMenu} deleteCallback={deleteComment}
                      entityName="comment" />
        }
        {
          replyUsername &&
          <span className="Comment-section-reply-username">
            <Username username={replyUsername} rank={replyRank} />
            <span className="icon-reply" />
          </span>
        }
        {
          avatarData &&
          <img className="Comment-section-avatar" src={avatarData} alt="avatar" />
        }
        <div className="Comment-section-comment-body">
          <Username username={info.username} rank={rank} />
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
              <button className="Askd-form-link" onClick={openEditForm}>
                Edit
              </button>
              <button className="Askd-form-link" onClick={openDeleteMenu}>
                Delete
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Comment;
