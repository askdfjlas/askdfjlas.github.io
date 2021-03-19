import React, { useEffect } from 'react';
import CreateLoadingComponent from './CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import RootComment from '../CommentForm/RootComment';
import AddCommentForm from '../CommentForm/AddCommentForm';
import queryString from 'query-string';
import '../css/CommentSection.css';

function CreateCommentComponent(getComments, addComment) {
  function CommentComponent({ otherProps, info, screen }) {
    useEffect(() => {
      const urlParams = queryString.parse(window.location.search);
      if(urlParams.linkedComment) {
        const commentElement = document.getElementById(urlParams.linkedComment);
        if(commentElement) {
          commentElement.scrollIntoView();
        }
      }
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
              <RootComment info={comment} replyCallback={replyCallback} />
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
            Comments ({comments.length})
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
