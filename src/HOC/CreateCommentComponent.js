import React, { useRef, useEffect } from 'react';
import CreateLoadingComponent from './CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import RootComment from '../CommentForm/RootComment';
import AddCommentForm from '../CommentForm/AddCommentForm';
import UsersApi from '../Api/UsersApi';
import queryString from 'query-string';
import '../css/CommentSection.css';

function CreateCommentComponent(getComments, addComment, deleteComment) {
  function CommentComponent({ otherProps, info, screen }) {
    let mounted = useRef(true);
    let userAvatars = useRef({});
    let userAvatarSubscriptions = useRef({});
    let addAvatarSubscriptions = useRef({});

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    });

    useEffect(() => {
      const urlParams = queryString.parse(window.location.search);
      if(urlParams.linkedComment) {
        const commentElement = document.getElementById(urlParams.linkedComment);
        if(commentElement) {
          commentElement.scrollIntoView();
        }
      }
    });

    useEffect(() => {
      if(!info) {
        return;
      }

      userAvatars.current = {};
      userAvatarSubscriptions.current = {};
      addAvatarSubscriptions.current = {};

      const getUserAvatarData = async (username) => {
        const userInfo = await UsersApi.getUserInfo(username, true);
        userAvatars.current[username] = userInfo.avatarData;
        for(const callback of userAvatarSubscriptions.current[username]) {
          if(mounted.current) {
            callback(userInfo.avatarData);
          }
        }
      };

      const initializeAvatarSystem = (username) => {
        userAvatars.current[username] = null;
        userAvatarSubscriptions.current[username] = [];
        addAvatarSubscriptions.current[username] = (callback) => {
          if(userAvatars.current[username] && mounted.current) {
            callback(userAvatars.current[username]);
          }
          else {
            userAvatarSubscriptions.current[username].push(callback);
          }
        };
        getUserAvatarData(username);
      };

      for(const comment of info.comments) {
        if(!(comment.username in userAvatars.current)) {
          initializeAvatarSystem(comment.username);
        }
        for(const reply of comment.replies) {
          if(!(reply.username in userAvatars.current)) {
            initializeAvatarSystem(reply.username);
          }
        }
      }
    }, [info]);

    const addCallback = async (newCommentContent) => {
      await addComment(otherProps, newCommentContent, null, null);
    };

    const replyCallback = async (newCommentContent, rootReplyId, replyId) => {
      await addComment(otherProps, newCommentContent, rootReplyId, replyId);
    }

    const deleteCallback = async (problemId) => {
      await deleteComment(otherProps, problemId);
    };

    if(screen === LoadState.LOADING || otherProps.doNotShow) {
      return null;
    }
    else {
      const comments = info.comments;
      let commentsContent;

      if(comments.length === 0) {
        commentsContent = (
          <p className="User-notes-nothing">
            There are no comments yet!
          </p>
        );
      }
      else {
        let commentListItems = [];
        for(let i = 0; i < comments.length; i++) {
          const comment = comments[i];
          commentListItems.push(
            <li key={i} className="Comment-section-root-comment">
              <RootComment info={comment} replyCallback={replyCallback}
                           deleteCallback={deleteCallback}
                           loggedInUsername={info.loggedInUsername}
                           addAvatarSubscriptions={addAvatarSubscriptions.current} />
            </li>
          );
        }

        commentsContent = (
          <ol className="Comment-section-comments">
            { commentListItems }
          </ol>
        );
      }

      return (
        <div className="Module-outer-space Comment-section">
          <h2 className="Module-heading">
            Comments
          </h2>
          <AddCommentForm addCallback={addCallback} />
          { commentsContent }
        </div>
      );
    }
  }

  return CreateLoadingComponent(getComments, null, null, CommentComponent);
}

export default CreateCommentComponent;
