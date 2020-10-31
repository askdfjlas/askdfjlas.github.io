import React, { Component } from 'react';
import Caret from './Caret';
import VirtualTextEditor from './VirtualTextEditor';
import Block from './Block';
import Utils from '../Utils';
import '../css/TextEditor.css';

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.id = `Askd-text-editor${this.props.uniqueKey}`;
    this.virtualTextEditor = new VirtualTextEditor();
    this.caret = new Caret(this.id);

    this.caretIndex = 0;
    this.caretPosition = 0;

    this.composing = false;
    this.compositionIndex = null;
    this.compositionPosition = null;

    this.state = {
      content: this.virtualTextEditor.getContent()
    };
  }

  async delete() {
    const caretInfo = this.caret.getInfo();

    if(!caretInfo.rangeSelect) {
      [ this.caretIndex, this.caretPosition ] = this.virtualTextEditor.delete(
        caretInfo.index, caretInfo.position - 1,
        caretInfo.index, caretInfo.position
      );
    }
    else {
      [ this.caretIndex, this.caretPosition ]  = this.virtualTextEditor.delete(
        caretInfo.leftIndex, caretInfo.leftPosition,
        caretInfo.rightIndex, caretInfo.rightPosition
      );
    }

    await this.updateText();
  }

  async insert(newString) {
    const caretInfo = this.caret.getInfo();

    if(caretInfo.rangeSelect) {
      await this.delete();
    }
    else {
      this.caretIndex = caretInfo.index;
      this.caretPosition = caretInfo.position;
    }

    [ this.caretIndex, this.caretPosition ] = this.virtualTextEditor.insert(
      this.caretIndex, this.caretPosition, newString
    );

    await this.updateText();
  }

  async compositionInsert(newString) {
    [ this.caretIndex, this.caretPosition ] = this.virtualTextEditor.insert(
      this.compositionIndex, this.compositionPosition, newString
    );

    await this.updateText();
  }

  async updateText() {
    await Utils.setStatePromise(this, {
      content: this.virtualTextEditor.getContent()
    });
  }

  componentDidMount() {
    this.textEditor = document.getElementById(this.id);

    // Unsupported keys and browser anomalies
    this.textEditor.addEventListener('keydown', async (event) => {
      // TBD, bro who even uses this button lol
      if(event.key === 'Delete') {
        event.preventDefault();
      }

      /* ios/mobile anomaly: pressing delete at the beginning of the textbox
         doesn't fire a beforeinput event */
      if(event.key === 'Backspace' && !this.composing) {
        const caretInfo = this.caret.getInfo();
        if(!caretInfo.rangeSelect &&
            caretInfo.index === 0 && caretInfo.position === 0) {
          event.preventDefault();
        }
      }
    });

    this.textEditor.addEventListener('beforeinput', async (event) => {
      if(event.isComposing || this.composing) {
        return;
      }

      event.preventDefault();

      if(event.inputType === 'deleteContentBackward') {
        await this.delete();
      }
      else if(event.inputType === 'insertParagraph') {
        await this.insert(String.fromCharCode(10));
      }
      else {
        const newChar = event.data;
        await this.insert(newChar);
      }
    });

    this.textEditor.addEventListener('paste', async (event) => {
      const pasteText = event.clipboardData.getData('Text');

      await this.insert(pasteText);
      event.preventDefault();
    });

    this.textEditor.addEventListener('compositionstart', async (event) => {
      let caretInfo = this.caret.getInfo();

      if(caretInfo.rangeSelect) {
        await this.delete();
        caretInfo = this.caret.getInfo();
      }

      this.composing = true;
      this.compositionIndex = caretInfo.index;
      this.compositionPosition = caretInfo.position;

      /* Better prevent my braindamaged browser from overwriting the next block
         with a fucking span tag LOL */
      let nextBlockElement = document.getElementById(this.id +
        (this.compositionIndex + 1));
      if(nextBlockElement) {
        nextBlockElement.setAttribute('contenteditable', 'false');
      }
    });

    this.textEditor.addEventListener('compositionend', async (event) => {
      if(!this.composing) {
        return;
      }

      let nextBlockElement = document.getElementById(this.id +
        (this.compositionIndex + 1));
      if(nextBlockElement) {
        nextBlockElement.setAttribute('contenteditable', 'true');
      }

      this.composing = false;
      await this.compositionInsert(event.data);
    });
  }

  componentDidUpdate() {
    /* All of this code is necessary because there is no way to
      preventDefault a compositionend event in some browsers... This project
      really makes me want to just fucking hang myself. */
    let junkNodes = [];
    for(const node of this.textEditor.childNodes) {
      if(node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR' ||
         node.nodeName === 'SPAN') {
        junkNodes.push(node);
      }
    }

    for(const node of junkNodes) {
      this.textEditor.removeChild(node);
    }

    for(let i = 0; i < this.state.content.length; i++) {
      let childElement = this.textEditor.children[i];
      if(childElement.innerHTML !== this.state.content[i].c) {
        childElement.childNodes[0].nodeValue = this.state.content[i].c;
      }
    }

    this.caret.updatePosition(this.caretIndex, this.caretPosition);
  }

  render() {
    let contentElements = [];
    this.state.content.forEach((block, i) => {
      contentElements.push(
        <Block block={block} id={this.id} index={i} key={i} />
      );
    });

    return (
      <div className="Askd-text-editor">
        <div className="Askd-text-editor-toolbar">
          <ul>
            <li><button type="button">Bold</button></li>
          </ul>
        </div>
        <div className="Askd-text-editor-text" id={this.id} tabIndex="0"
             contentEditable="true" suppressContentEditableWarning="true"
             spellCheck="false">
             { contentElements }
        </div>
      </div>
    );
  }
}

export default TextEditor;
