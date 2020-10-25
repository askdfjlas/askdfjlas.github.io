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

  componentDidMount() {
    this.textEditor = document.getElementById(this.id);

    this.textEditor.addEventListener('keydown', async (event) => {
      if(event.key === 'Backspace') {
        await this.delete();

        event.preventDefault();
      }
    });

    this.textEditor.addEventListener('keypress', async (event) => {
      const newChar = event.key;
      const caretInfo = this.caret.getInfo();

      if(newChar === 'Enter') {
        // TBD
        event.preventDefault();
        return;
      }

      if(!caretInfo.rangeSelect) {
        await this.insert(newChar);
      }
      else {
        await this.delete();
        await this.insert(newChar);
      }

      event.preventDefault();
    });
  }

  async updateText() {
    await Utils.setStatePromise(this, {
      content: this.virtualTextEditor.getContent()
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
