import React from 'react';
import Block from './Block';

function TextEditorContent({ content, id, editable }) {
  let contentElements = [];
  content.forEach((block, i) => {
    contentElements.push(
      <Block block={block} id={id} index={i} key={i} />
    );
  });

  return (
    <div className="Askd-text-editor-text" id={id} tabIndex="0"
         contentEditable={editable} suppressContentEditableWarning="true"
         spellCheck="false">
         { contentElements }
    </div>
  );
}

export default TextEditorContent;
