import React, { useState, useRef } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import UserAuthApi from '../Api/UserAuthApi';
import Username from '../Misc/Username';

function RootComment({ info, addInfoSubscriptions, replyCallback,
                       editCallback, deleteCallback, loggedInUsername }) {
  const [ editorActive, setEditorActive ] = useState(false);
  const [ replyUsername, setReplyUsername ] = useState(null);
  const [ replyRank, setReplyRank ] = useState(null);
  const editorReplyInfo = useRef({
    content: null,
    replyId: null
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

  const createReplyHandler =
    (commentReplyId, commentReplyUsername, subscribeToUserInfo) => {
      return async () => {
        const username = await UserAuthApi.getUsername();
        if(!username) {
          window.suggestUserRegister();
          return;
        }

        editorReplyInfo.current.replyId = commentReplyId;
        setReplyUsername(commentReplyUsername);
        setEditorActive(true);

        subscribeToUserInfo((userInfo) => {
          if(editorReplyInfo.current.replyId === commentReplyId) {
            setReplyRank(userInfo.cfRank);
          }
        });
      };
  }

  let replyListItems = [];
  let replyIdToUsername = {
    [ info.commentId ]: info.username
  };

  for(let i = 0; i < info.replies.length; i++) {
    const reply = info.replies[i];
    const commentReplyUsername = replyIdToUsername[reply.replyId];
    const subscribeToUserInfo = addInfoSubscriptions[reply.username];
    const subscribeToReplyInfo = addInfoSubscriptions[commentReplyUsername];
    const replyCallback = createReplyHandler(
      reply.commentId, reply.username, subscribeToUserInfo
    );

    replyListItems.push(
      <li key={i} className="Comment-section-reply-comment">
        <Comment info={reply} replyUsername={commentReplyUsername}
                 subscribeToUserInfo={subscribeToUserInfo}
                 subscribeToReplyInfo={subscribeToReplyInfo}
                 replyCallback={replyCallback} editCallback={editCallback}
                 deleteCallback={deleteCallback}
                 loggedInUsername={loggedInUsername} />
      </li>
    );
    replyIdToUsername[reply.commentId] = reply.username;
  }

  const replyCommentForm = (
    <div className="Comment-section-reply-form">
      <span className="Comment-section-reply-username">
        <Username username={replyUsername} rank={replyRank} />
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

  const rootCommentSubscribeToUserInfo = addInfoSubscriptions[info.username];
  const rootCommentReplyCallback = createReplyHandler(
    info.commentId, info.username, rootCommentSubscribeToUserInfo
  );

  return (
    <>
      <Comment info={info} subscribeToUserInfo={rootCommentSubscribeToUserInfo}
               replyCallback={rootCommentReplyCallback}
               editCallback={editCallback} deleteCallback={deleteCallback}
               loggedInUsername={loggedInUsername} />
      <ol className="Comment-section-replies">
        { replyListItems }
        { editorActive && replyCommentForm }
      </ol>
    </>
  );
}

export default RootComment;
