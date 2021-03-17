import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateLoadingComponent from './CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import TextEditorContent from '../TextEditor/TextEditorContent';
import AddCommentForm from '../CommentForm/AddCommentForm';
import Utils from '../Utils';
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
          const id = comment.commentId;
          const authorUsername = comment.username;
          const timeAgoString = Utils.getTimeAgoString(comment.creationTime);
          const content = JSON.parse(comment.content);

          commentListItems.push(
            <li key={i} id={id} className="Module-outer-space">
              <Link className="Username" to={`/users/${authorUsername}`}>
                {authorUsername}
              </Link>
              <span className="Comment-section-timestamp">
                {timeAgoString}
              </span>
              <TextEditorContent id={id + 'Z'} content={content}
                                 editable={false} />
            </li>
          );
        }

        commentsContent = (
          <ol className="Comment-section-comments">
            { commentListItems }
          </ol>
        );
      }

      const addCallback = async (newCommentContent) => {
        await addComment(otherProps, newCommentContent, null);
      };

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
