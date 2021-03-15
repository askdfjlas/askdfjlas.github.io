import React from 'react';
import CreateLoadingComponent from './CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import '../css/CommentSection.css';

function CommentComponent({ otherProps, info, screen }) {
  if(screen === LoadState.LOADING || otherProps.doNotShow) {
    return null;
  }
  else {
    const comments = info.comments;
    let commentsContent;
    if(comments.length === 0) {
      commentsContent = (
        <div>
          Nothign to see here bro!!
        </div>
      );
    }
    else {
      commentsContent = (
        <div>
          { JSON.stringify(comments) }
        </div>
      );
    }

    return (
      <div className="Module-outer-space Comment-section">
        <h2 className="Module-heading">
          Haha penis
        </h2>
        { commentsContent }
      </div>
    );
  }
}

function CreateCommentComponent(getComments, addComment) {
  return CreateLoadingComponent(getComments, null, null, CommentComponent);
}

export default CreateCommentComponent;
