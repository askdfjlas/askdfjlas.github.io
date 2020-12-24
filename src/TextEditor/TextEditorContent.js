import React from 'react';
import Block from './Block/Block';

function TextEditorContent({ content, id, editable, editorMask, caretInfo, handleBlur }) {
  let contentElements = [];
  content.forEach((block, i) => {
    let selected = false;
    if(caretInfo && caretInfo.editorSelected) {
      if(!caretInfo.rangeSelect && caretInfo.index === i) {
        selected = true;
      }
      if(caretInfo.rangeSelect && caretInfo.leftIndex === i) {
        selected = true;
      }
    }

    contentElements.push(
      <Block block={block} id={id} index={i} key={i} editorMask={editorMask}
             selected={selected} />
    );
  });

  return (
    <div className="Askd-text-editor-text" id={id} tabIndex="0"
         contentEditable={editable} suppressContentEditableWarning="true"
         spellCheck="false" onBlur={handleBlur}>
         { contentElements }
    </div>
  );
}

export default TextEditorContent;
