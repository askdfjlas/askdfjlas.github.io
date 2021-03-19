import React, { useState } from 'react';
import TextEditor from '../TextEditor/TextEditor';

function CommentForm({ cancelCallback, addCallback, initialContent, updateCallback }) {
  const [ commentContent, setCommentContent ] = useState(initialContent);
  const [ addCommentLoading, setAddCommentLoading ] = useState(false);

  const handleEditorChange = (newContent) => {
    setCommentContent(newContent);
    if(updateCallback) {
      updateCallback(newContent);
    }
  };

  const handleAddComment = async () => {
    setAddCommentLoading(true);
    const success = await addCallback(commentContent);
    if(!success) {
      setAddCommentLoading(false);
    }
  };

  const textEmpty = !commentContent || commentContent[0].c.length === 0;

  return (
    <div className="Comment-section-add">
      <TextEditor focusOnMount={true} initialContent={commentContent}
                  onChange={handleEditorChange} />
      <div className="Askd-form">
        <input type="button" value="Cancel" className="Askd-button Askd-not-fullwidth"
               onClick={cancelCallback} />
        <input type="button" value="Comment" disabled={textEmpty || addCommentLoading}
               className="Askd-button Askd-not-fullwidth" onClick={handleAddComment} />
      </div>
    </div>
  );
}

export default CommentForm;
