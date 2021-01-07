import ContentType from './ContentType';

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

  return handleSelectionChange;
}

export default registerEventHandlers;
