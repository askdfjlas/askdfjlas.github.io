import React, { Component } from 'react';
import Caret from './Caret';
import VirtualTextEditor from './VirtualTextEditor';
import Utils from '../Utils';
import '../css/TextEditor.css';

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.id = `Askd-text-editor${this.props.uniqueKey}`;
    this.virtualTextEditor = new VirtualTextEditor();
    this.caret = new Caret(this.id);

    this.composing = false;
    this.compositionIndex = null;
    this.compositionPosition = null;

    this.state = {
      content: this.virtualTextEditor.getContent()
    };
  }

  async delete() {
    const caretInfo = this.caret.getInfo();

    let newCaretIndex, newCaretPosition;
    if(!caretInfo.rangeSelect) {
      [ newCaretIndex, newCaretPosition ] = this.virtualTextEditor.delete(
        caretInfo.index, caretInfo.position - 1,
        caretInfo.index, caretInfo.position
      );
    }
    else {
      [ newCaretIndex, newCaretPosition ] = this.virtualTextEditor.delete(
        caretInfo.leftIndex, caretInfo.leftPosition,
        caretInfo.rightIndex, caretInfo.rightPosition
      );
    }

    await this.updateText();
    this.caret.updatePosition(newCaretIndex, newCaretPosition);
  }

  async insert(newString) {
    const caretInfo = this.caret.getInfo();

    let [ newCaretIndex, newCaretPosition ] = this.virtualTextEditor.insert(
      caretInfo.index, caretInfo.position, newString
    );

    await this.updateText();
    this.caret.updatePosition(newCaretIndex, newCaretPosition);
  }

  async compositionInsert(newString) {
    let [ newCaretIndex, newCaretPosition ] = this.virtualTextEditor.insert(
      this.compositionIndex, this.compositionPosition, newString
    );

    await this.updateText();
    this.caret.updatePosition(newCaretIndex, newCaretPosition);
  }

  async updateText() {
    if(this.textEditor.childNodes[0].nodeType === Node.TEXT_NODE) {
      this.textEditor.removeChild(this.textEditor.childNodes[0]);
    }

    await Utils.setStatePromise(this, {
      content: this.virtualTextEditor.getContent()
    });
  }

  componentDidMount() {
    this.textEditor = document.getElementById(this.id);

    this.textEditor.addEventListener('keypress', async (event) => {
      const character = event.key;

      if(character === 'Enter' || this.composing) {
        // TBD
        event.preventDefault();
        return;
      }
    });

    this.textEditor.addEventListener('beforeinput', async (event) => {
      if(event.isComposing) {
        return;
      }

      event.preventDefault();

      if(event.inputType === 'deleteContentBackward') {
        await this.delete();
      }
      else {
        const newChar = event.data;
        const caretInfo = this.caret.getInfo();

        if(!caretInfo.rangeSelect) {
          await this.insert(newChar);
        }
        else {
          await this.delete();
          await this.insert(newChar);
        }
      }
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
    });

    this.textEditor.addEventListener('compositionend', async (event) => {
      this.composing = false;
      await this.compositionInsert(event.data);
    });
  }

  render() {
    let contentElements = [];
    this.state.content.forEach((block, i) => {
      contentElements.push(
        <div id={this.id + i} key={i} index={i}>
          { block.c }
        </div>
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
             contentEditable="true" suppressContentEditableWarning={true}
             spellCheck="false">
             { contentElements }
        </div>
      </div>
    );
  }
}

export default TextEditor;
