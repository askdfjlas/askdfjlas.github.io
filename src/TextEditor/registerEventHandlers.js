import ContentType from './ContentType';
import sanitizeTextArea from './sanitizeTextArea';

const registerEventHandlers = (that) => {
  that.textEditor.addEventListener('keydown', async (event) => {
    let mathSelected = (that.state.editorMask & ContentType.MATH) > 0;

    /* TBD, bro who even uses that button lol */
    if(event.key === 'Delete') {
      event.preventDefault();
    }
    else if(event.key === 'Backspace' && !that.composing) {
      await that.delete();
      event.preventDefault();
    }
    else if(event.key === 'Enter' && !that.composing && !mathSelected) {
      await that.insert(String.fromCharCode(10));
      event.preventDefault();
    }
    else if(event.key === 'Enter') {
      event.preventDefault();
    }
  });

  that.textEditor.addEventListener('beforeinput', async (event) => {
    if(event.isComposing || that.composing) {
      return;
    }

    event.preventDefault();

    /* Mobile autocorrect and word selection from a menu */
    if(event.inputType === 'insertReplacementText') {
      that.caretInfo.rangeSelect = true;
      const insertedString = event.dataTransfer.getData('text');
      await that.insert(insertedString);
    }
    /* Generic event with a valid 'data'; things like undo/redo operations and
       drag and drop are TBD */
    else if(event.data) {
      await that.insert(event.data);
    }
  });

  /* An equivalent handler to beforeinput, but with text sanitization - this is
  for browsers which don't have the beforeinput event */
  that.textEditor.addEventListener('input', async (event) => {
    if(event.isComposing || that.composing) {
      return;
    }

    if(event.inputType === 'insertReplacementText') {
      sanitizeTextArea(that.textEditor, that.state.content);
      that.caretInfo.rangeSelect = true;
      const insertedString = event.dataTransfer.getData('text');
      await that.insert(insertedString);
    }
    else if(event.data) {
      sanitizeTextArea(that.textEditor, that.state.content);
      await that.insert(event.data, true);
    }
  });

  that.textEditor.addEventListener('paste', async (event) => {
    event.preventDefault();

    const pasteText = event.clipboardData.getData('Text');
    await that.insert(pasteText);
  });

  that.textEditor.addEventListener('compositionstart', async (event) => {
    if(that.caretInfo.rangeSelect) {
      await that.delete();
    }

    that.composing = true;
    that.compositionIndex = that.caretInfo.index;
    that.compositionPosition = that.caretInfo.position;
  });

  that.textEditor.addEventListener('compositionend', async (event) => {
    if(!that.composing) {
      return;
    }

    that.composing = false;
    await that.compositionInsert(event.data);
  });

  let handleSelectionChange = (event) => {
    if(that.composing) {
      return;
    }

    let selectionChanged = false;
    try {
      const selection = window.getSelection();
      const anchorNode = selection.anchorNode;

      if(that.textEditor.contains(anchorNode)) {
        const newCaretInfo = that.caret.getInfo();
        for(const key in newCaretInfo) {
          if(newCaretInfo.hasOwnProperty(key) &&
             that.caretInfo[key] !== newCaretInfo[key]) {
            selectionChanged = true;
          }
        }
      }
    }
    catch(err) {
      /* anchorElement isn't a div inside the text editor */
    }

    if(selectionChanged) {
      that.selectionChanged();
    }
  };

  document.addEventListener('selectionchange', handleSelectionChange);

  let handleBlur = (event) => {
    /* Don't blur if event.relatedTarget is one of the toolbar buttons or
    contained within the 'textarea' */
    if(event.relatedTarget) {
      let isIcon = event.relatedTarget.classList.contains('Askd-tb-icon') &&
         that.outerTextEditor.contains(event.relatedTarget);
      let contained = that.textEditor.contains(event.relatedTarget);

      if(isIcon || contained) {
        return;
      }
    }

    if(that.caretInfo.editorSelected) {
      that.caretInfo.editorSelected = false;
      if(that.caretInfo.insideCaretBlock) {
        that.caretInfo.insideCaretBlock = false;
        that.caret.removeCaretBlock();
        that.virtualTextEditor.removeCaretBlock();
        that.updateContent();
      }
      else {
        that.forceUpdate();
      }
    }
  };

  return [ handleSelectionChange, handleBlur ];
}

export default registerEventHandlers;
