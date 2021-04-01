import React from 'react';
import Block from './Block/Block';
import ContentType from './ContentType';

function TextEditorContent({ content, id, editable, caretInfo, handleBlur,
                             handleFocus, handleBlockUpdate }) {
  let contentElements = [];

  content.forEach((block, i) => {
    let selected = false;

    if(editable && caretInfo.editorSelected) {
      if(caretInfo.rangeSelect) {
        if(block.m & ContentType.IMAGE) {
          selected = caretInfo.leftIndex < i && i <= caretInfo.rightIndex;
        }
        else {
          selected = caretInfo.leftIndex <= i && i <= caretInfo.rightIndex;
        }
      }
      if(!caretInfo.rangeSelect && caretInfo.index === i && !caretInfo.insideCaretBlock) {
        selected = true;
      }
    }

    contentElements.push(
      <Block block={block} id={id} index={i} key={i} selected={selected}
             editable={editable} handleBlockUpdate={handleBlockUpdate} />
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
