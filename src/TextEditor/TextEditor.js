import React, { Component } from 'react';
import Caret from './Caret';
import Toolbar from './Toolbar';
import VirtualTextEditor from './VirtualTextEditor';
import TextEditorContent from './TextEditorContent';
import MaskManager from './MaskManager';
import Utils from '../Utils';
import registerEventHandlers from './registerEventHandlers';
import '../css/TextEditor.css';

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.id = this.props.uniqueKey ?
                `Askd-text-editor${this.props.uniqueKey}` : 'Askd-text-editor';
    this.virtualTextEditor = new VirtualTextEditor(this.props.initialContent);
    this.caret = new Caret(this.id);

    this.contentChanged = false;
    this.caretInfo = {
      editorSelected: false,
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

  async toolbarUpdate(bit) {
    this.textEditor.focus();

    const on = (this.state.editorMask & bit) === 0;
    const newToolbarMask = MaskManager.toolbarMergeBit(bit, on, this.state.editorMask);

    await this.updateMask(newToolbarMask);
    await this.rangeMaskUpdate(bit, on);
  }

  updateCaretInfo() {
    const newCaretInfo = this.caret.getInfo();
    const maxCaretIndex = this.state.content.length - 2;

    /* Maintain previous info for the other selection type */
    if(newCaretInfo.rangeSelect) {
      let badCaretRange = false;

      if(newCaretInfo.leftIndex >= maxCaretIndex && newCaretInfo.leftPosition > 0) {
        newCaretInfo.leftIndex = maxCaretIndex;
        newCaretInfo.leftPosition = 0;
        badCaretRange = true;
      }

      if(newCaretInfo.rightIndex >= maxCaretIndex && newCaretInfo.rightPosition > 0) {
        newCaretInfo.rightIndex = maxCaretIndex;
        newCaretInfo.rightPosition = 0;
        badCaretRange = true;
      }

      if(badCaretRange) {
        this.caret.setRangePosition(newCaretInfo.leftIndex,
          newCaretInfo.leftPosition, newCaretInfo.rightIndex,
          newCaretInfo.rightPosition
        );
      }

      this.caretInfo.leftIndex = newCaretInfo.leftIndex;
      this.caretInfo.leftPosition = newCaretInfo.leftPosition;
      this.caretInfo.rightIndex = newCaretInfo.rightIndex;
      this.caretInfo.rightPosition = newCaretInfo.rightPosition;
      this.caretInfo.rangeSelect = true;
    }
    else {
      if(newCaretInfo.index >= maxCaretIndex && newCaretInfo.position > 0) {
        newCaretInfo.index = maxCaretIndex;
        newCaretInfo.position = 0;
        this.caret.setPosition(newCaretInfo.index, newCaretInfo.position);
      }

      this.caretInfo.index = newCaretInfo.index;
      this.caretInfo.position = newCaretInfo.position;
      this.caretInfo.rangeSelect = false;
    }

    this.caretInfo.editorSelected = true;
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

  async componentDidUpdate() {
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

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let handleBlur = (event) => {
      if(this.caretInfo.editorSelected) {
        this.caretInfo.editorSelected = false;
        this.forceUpdate();
      }
    };

    return (
      <div className="Askd-text-editor" id={this.id + '!'}>
        <Toolbar mask={this.state.editorMask} callback={this.toolbarUpdate} />
        <TextEditorContent content={this.state.content} id={this.id}
                           editable={true} handleBlur={handleBlur}
                           editorMask={this.state.editorMask}
                           caretInfo={this.caretInfo} />
      </div>
    );
  }
}

export default TextEditor;
