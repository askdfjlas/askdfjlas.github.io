const registerEventHandlers = (that) => {
  that.textEditor.addEventListener('keydown', async (event) => {
    /* TBD, bro who even uses that button lol */
    if(event.key === 'Delete') {
      event.preventDefault();
    }
    else if(event.key === 'Backspace' && !that.composing) {
      await that.delete();
      event.preventDefault();
    }
    else if(event.key === 'Enter' && !that.composing) {
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

    /* Prevent browser from overwriting the next block */
    let nextBlockElement = document.getElementById(that.id +
      (that.compositionIndex + 1));
    if(nextBlockElement) {
      nextBlockElement.setAttribute('contenteditable', 'false');
    }
  });

  that.textEditor.addEventListener('compositionend', async (event) => {
    if(!that.composing) {
      return;
    }

    /* Composition has ended; set the next block to be editable again */
    let nextBlockElement = document.getElementById(that.id +
      (that.compositionIndex + 1));
    if(nextBlockElement) {
      nextBlockElement.setAttribute('contenteditable', 'true');
    }

    that.composing = false;
    await that.compositionInsert(event.data);
  });

  document.addEventListener('selectionchange', async (event) => {
    if(that.composing) {
      return;
    }

    try {
      const selection = window.getSelection();
      const anchorElement = selection.anchorNode.parentElement;
      const parentElement = anchorElement.parentElement;

      if(anchorElement.getAttribute('id') === that.id + '!' ||
         parentElement.getAttribute('id') === that.id) {
        await that.selectionChanged();
      }
    }
    catch(err) {
      /* anchorElement isn't a div inside the text editor */
    }
  });
}

export default registerEventHandlers;
