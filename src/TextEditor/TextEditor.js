import React, { Component } from 'react';
import Caret from './Caret';
import Toolbar from './Toolbar';
import VirtualTextEditor from './VirtualTextEditor';
import Block from './Block';
import Utils from '../Utils';
import registerEventHandlers from './registerEventHandlers';
import '../css/TextEditor.css';

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.id = this.props.uniqueKey ?
                `Askd-text-editor${this.props.uniqueKey}` : 'Askd-text-editor';
    this.virtualTextEditor = new VirtualTextEditor();
    this.caret = new Caret(this.id);

    this.contentChanged = false;
    this.caretInfo = {
      rangeSelect: false,
      index: 0,
      position: 0
    };

    this.composing = false;
    this.compositionIndex = null;
    this.compositionPosition = null;

    this.state = {
      content: this.virtualTextEditor.getContent(),
      editorMask: 0
    };

    this.toolbarUpdate = this.toolbarUpdate.bind(this);
  }

  async delete() {
    if(!this.caretInfo.rangeSelect) {
      [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.delete(
        this.caretInfo.index, this.caretInfo.position - 1,
        this.caretInfo.index, this.caretInfo.position
      );
    }
    else {
      [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.delete(
        this.caretInfo.leftIndex, this.caretInfo.leftPosition,
        this.caretInfo.rightIndex, this.caretInfo.rightPosition
      );
    }

    this.caretInfo.rangeSelect = false;
    await this.updateText();
  }

  async insert(newString) {
    this.updateCaretInfo();

    if(this.caretInfo.rangeSelect) {
      await this.delete();
    }

    [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.insert(
      this.caretInfo.index, this.caretInfo.position, newString,
      this.state.editorMask
    );

    this.caretInfo.rangeSelect = false;
    await this.updateText();
  }

  async compositionInsert(newString) {
    [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.insert(
      this.compositionIndex, this.compositionPosition, newString,
      this.state.editorMask
    );

    this.caretInfo.rangeSelect = false;
    await this.updateText();
  }

  async rangeMaskUpdate(bit, on) {
    if(!this.caretInfo.rangeSelect) {
      return;
    }

    [ this.caretInfo.leftIndex, this.caretInfo.leftPosition,
      this.caretInfo.rightIndex, this.caretInfo.rightPosition ] =
    this.virtualTextEditor.rangeMaskUpdate(
      this.caretInfo.leftIndex, this.caretInfo.leftPosition,
      this.caretInfo.rightIndex, this.caretInfo.rightPosition, bit, on
    );

    await this.updateText();
  }

  async updateText() {
    this.contentChanged = true;
    await Utils.setStatePromise(this, {
      content: this.virtualTextEditor.getContent()
    });
  }

  async updateMask(newMask) {
    await Utils.setStatePromise(this, {
      editorMask: newMask
    });
  }

  async toolbarUpdate(bit, on) {
    this.textEditor.focus();
    await this.updateMask(this.state.editorMask ^ bit);
    await this.rangeMaskUpdate(bit, on);
  }

  updateCaretInfo() {
    const newCaretInfo = this.caret.getInfo();

    /* Maintain previous info for the other selection type */
    if(newCaretInfo.rangeSelect) {
      this.caretInfo.leftIndex = newCaretInfo.leftIndex;
      this.caretInfo.leftPosition = newCaretInfo.leftPosition;
      this.caretInfo.rightIndex = newCaretInfo.rightIndex;
      this.caretInfo.rightPosition = newCaretInfo.rightPosition;
      this.caretInfo.rangeSelect = true;
    }
    else {
      this.caretInfo.index = newCaretInfo.index;
      this.caretInfo.position = newCaretInfo.position;
      this.caretInfo.rangeSelect = false;
    }
  }

  async selectionChanged() {
    this.updateCaretInfo();

    let leftCharacterMask;
    if(this.caretInfo.rangeSelect) {
      leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.leftIndex, this.caretInfo.leftPosition, true
      );
    }
    else {
      leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.index, this.caretInfo.position, false
      );
    }

    await this.updateMask(leftCharacterMask);
  }

  componentDidMount() {
    this.textEditor = document.getElementById(this.id);
    registerEventHandlers(this);
  }

  componentDidUpdate() {
    if(!this.contentChanged) {
      return;
    }

    /* The rendered text must be manually sanitized since there's no way to
       preventDefault a compositionend event in some browsers... */
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

    if(this.caretInfo.rangeSelect) {
      this.caret.setRangePosition(
        this.caretInfo.leftIndex, this.caretInfo.leftPosition,
        this.caretInfo.rightIndex, this.caretInfo.rightPosition
      );
    }
    else {
      this.caret.setPosition(this.caretInfo.index, this.caretInfo.position);
    }

    this.contentChanged = false;
    this.updateCaretInfo();

    /* Callback with new content */
    if(this.props.onChange) {
      this.props.onChange(this.state.content);
    }
  }

  render() {
    let contentElements = [];
    this.state.content.forEach((block, i) => {
      contentElements.push(
        <Block block={block} id={this.id} index={i} key={i} />
      );
    });

    return (
      <div className="Askd-text-editor" id={this.id + '!'}>
        <Toolbar mask={this.state.editorMask} callback={this.toolbarUpdate} />
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
