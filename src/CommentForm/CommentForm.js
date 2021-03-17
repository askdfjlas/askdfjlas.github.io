import React, { useState } from 'react';
import TextEditor from '../TextEditor/TextEditor';

function CommentForm({ cancelCallback, addCallback}) {
  const [ commentContent, setCommentContent ] = useState(null);
  const [ addCommentLoading, setAddCommentLoading ] = useState(false);

  const handleEditorChange = (newContent) => {
    setCommentContent(newContent);
  };

  const handleAddComment = async () => {
    setAddCommentLoading(true);
    await addCallback(commentContent);
    setAddCommentLoading(false);
  };

  const textEmpty = !commentContent || commentContent[0].c.length === 0;

  return (
    <div className="Comment-section-add">
      <TextEditor id="Comment-section-add-new" focusOnMount={true}
                  initialContent={commentContent} onChange={handleEditorChange} />
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
