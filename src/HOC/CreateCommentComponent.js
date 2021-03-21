import React, { useRef, useEffect } from 'react';
import CreateLoadingComponent from './CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import RootComment from '../CommentForm/RootComment';
import AddCommentForm from '../CommentForm/AddCommentForm';
import UsersApi from '../Api/UsersApi';
import queryString from 'query-string';
import '../css/CommentSection.css';

function CreateCommentComponent(getComments, addComment) {
  function CommentComponent({ otherProps, info, screen }) {
    let mounted = useRef(true);

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
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    });

    const addCallback = async (newCommentContent) => {
      return await addComment(otherProps, newCommentContent, null, null);
    };

    const replyCallback = async (newCommentContent, rootReplyId, replyId) => {
      return await addComment(otherProps, newCommentContent, rootReplyId, replyId);
    }

    if(screen === LoadState.LOADING || otherProps.doNotShow) {
      return null;
    }
    else {
      let userAvatars = {};
      let userAvatarSubscriptions = {};
      let addAvatarSubscriptions = {};

      const getUserAvatarData = async (username) => {
        const userInfo = await UsersApi.getUserInfo(username, true);
        userAvatars[username] = userInfo.avatarData;
        for(const callback of userAvatarSubscriptions[username]) {
          if(mounted.current) {
            callback(userInfo.avatarData);
          }
        }
      };

      const initializeAvatarSystem = (username) => {
        userAvatars[username] = null;
        userAvatarSubscriptions[username] = [];
        addAvatarSubscriptions[username] = (callback) => {
          if(userAvatars[username] && mounted.current) {
            callback(userAvatars[username]);
          }
          else {
            userAvatarSubscriptions[username].push(callback);
          }
        };
        getUserAvatarData(username);
      };

      const comments = info.comments;
      for(const comment of comments) {
        if(!(comment.username in userAvatars)) {
          initializeAvatarSystem(comment.username);
        }
        for(const reply of comment.replies) {
          if(!(reply.username in userAvatars)) {
            initializeAvatarSystem(reply.username);
          }
        }
      }

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
                           addAvatarSubscriptions={addAvatarSubscriptions} />
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
