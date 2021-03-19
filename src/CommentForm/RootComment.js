import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CommentForm from './CommentForm';

function RootComment({ info, replyCallback }) {
  let replyListItems = [];
  let replyIdToUsername = {
    [ info.commentId ]: info.username
  };

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
    return () => {
      setEditorActive(true);
      editorReplyInfo.current.replyId = replyId;
      editorReplyInfo.current.replyUsername = replyUsername;
    };
  }

  for(let i = 0; i < info.replies.length; i++) {
    const reply = info.replies[i];
    const replyUsername = reply.replyId ? replyIdToUsername[reply.replyId] : null;
    const replyCallback = createReplyHandler(reply.commentId, reply.username);

    replyListItems.push(
      <li key={i} className="Comment-section-reply-comment">
        <Comment info={reply} replyUsername={replyUsername}
                 replyCallback={replyCallback} />
      </li>
    );
    replyIdToUsername[reply.commentId] = reply.username;
  }

  const rootCommentReplyCallback = createReplyHandler(
    info.commentId, info.username
  );

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

  return (
    <>
      <Comment info={info} replyCallback={rootCommentReplyCallback} />
      <ol className="Comment-section-replies">
        { replyListItems }
        { editorActive && replyCommentForm }
      </ol>
    </>
  );
}

export default RootComment;
