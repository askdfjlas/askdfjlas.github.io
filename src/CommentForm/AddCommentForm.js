import React, { useState } from 'react';
import CommentForm from './CommentForm';
import UserAuthApi from '../Api/UserAuthApi';

function AddCommentForm({ addCallback }) {
  const [ editorActive, setEditorActive ] = useState(false);
  const inputRef = React.createRef();

  const handleInactiveFocus = async (event) => {
    const username = await UserAuthApi.getUsername();
    if(!username) {
      inputRef.current.blur();
      window.suggestUserRegister();
    }
    else {
      setEditorActive(true);
    }
  };

  const handleCancelEditor = (event) => {
    setEditorActive(false);
  }

  if(!editorActive) {
    return (
      <div className="Comment-section-add">
        <input type="text" placeholder="Write a comment..."
               onFocus={handleInactiveFocus} ref={inputRef} />
      </div>
    );
  }
  else {
    return (
      <CommentForm cancelCallback={handleCancelEditor} addCallback={addCallback} />
    );
  }
}

export default AddCommentForm;
