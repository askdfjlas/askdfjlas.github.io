import React from 'react';
import Block from './Block/Block';

function TextEditorContent({ content, id, editable, caretInfo, handleBlur, handleFocus }) {
  let contentElements = [];

  content.forEach((block, i) => {
    let selected = false;

    if(editable && caretInfo.editorSelected) {
      if(caretInfo.rangeSelect && caretInfo.leftIndex <= i && i <= caretInfo.rightIndex) {
        selected = true;
      }
      if(!caretInfo.rangeSelect && caretInfo.index === i && !caretInfo.insideCaretBlock) {
        selected = true;
      }
    }

    contentElements.push(
      <Block block={block} id={id} index={i} key={i} selected={selected} />
    );
  });

  let outerClassName = 'Askd-text-editor-text';
  if(editable) {
    outerClassName += ' Askd-text-editor-editable';
  }
  else {
    outerClassName += ' Askd-text-editor-uneditable';
  }

  return (
    <div className={outerClassName} id={id} contentEditable={editable}
        suppressContentEditableWarning="true" spellCheck="false"
        onBlur={handleBlur} onFocus={handleFocus}>
         { contentElements }
    </div>
  );
}

export default TextEditorContent;
