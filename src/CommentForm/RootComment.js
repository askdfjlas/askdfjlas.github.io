import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CommentForm from './CommentForm';
import UserAuthApi from '../Api/UserAuthApi';

function RootComment({ info, addAvatarSubscriptions, replyCallback,
                       deleteCallback, loggedInUsername }) {
  const [ editorActive, setEditorActive ] = useState(false);
  const editorReplyInfo = useRef({
    content: null,
    replyId: null,
    replyUsername: null
  });

  const handleCancelEditor = () => {
    setEditorActive(false);
  }

  const editorUpdateCallback = (newContent) => {
    editorReplyInfo.current.content = newContent;
  };

  const editorAddCallback = async () => {
    return await replyCallback(
      editorReplyInfo.current.content,
      info.commentId,
      editorReplyInfo.current.replyId
    );
  };

  const createReplyHandler = (replyId, replyUsername) => {
    return async () => {
      const username = await UserAuthApi.getUsername();
      if(!username) {
        window.suggestUserRegister();
        return;
      }

      editorReplyInfo.current.replyId = replyId;
      editorReplyInfo.current.replyUsername = replyUsername;
      setEditorActive(true);
    };
  }

  let replyListItems = [];
  let replyIdToUsername = {
    [ info.commentId ]: info.username
  };

  for(let i = 0; i < info.replies.length; i++) {
    const reply = info.replies[i];
    const replyUsername = replyIdToUsername[reply.replyId];
    const replyCallback = createReplyHandler(reply.commentId, reply.username);
    const subscribeToAvatar = addAvatarSubscriptions[reply.username];

    replyListItems.push(
      <li key={i} className="Comment-section-reply-comment">
        <Comment info={reply} replyUsername={replyUsername}
                 subscribeToAvatar={subscribeToAvatar}
                 replyCallback={replyCallback} deleteCallback={deleteCallback}
                 loggedInUsername={loggedInUsername} />
      </li>
    );
    replyIdToUsername[reply.commentId] = reply.username;
  }

  const replyUsername = editorReplyInfo.current.replyUsername;
  const replyCommentForm = (
    <div className="Comment-section-reply-form">
      <span className="Comment-section-reply-username">
        <Link className="Username" to={`/users/${replyUsername}`}>
          {replyUsername}
        </Link>
        <span className="icon-reply" />
      </span>
      <li className="Comment-section-reply-comment">
        <CommentForm cancelCallback={handleCancelEditor}
                     updateCallback={editorUpdateCallback}
                     addCallback={editorAddCallback}
                     initialContent={editorReplyInfo.current.content} />
      </li>
    </div>
  );

  const rootCommentReplyCallback = createReplyHandler(
    info.commentId, info.username
  );
  const rootCommentSubscribeToAvatar = addAvatarSubscriptions[info.username];

  return (
    <>
      <Comment info={info} replyCallback={rootCommentReplyCallback}
               subscribeToAvatar={rootCommentSubscribeToAvatar}
               deleteCallback={deleteCallback}
               loggedInUsername={loggedInUsername} />
      <ol className="Comment-section-replies">
        { replyListItems }
        { editorActive && replyCommentForm }
      </ol>
    </>
  );
}

export default RootComment;
