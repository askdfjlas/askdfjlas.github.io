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
      rangeSelect: false,
      index: 0,
      position: 0,
      editorSelected: false,
      insideCaretBlock: false
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
    await this.insertionUpdate();
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
    await this.insertionUpdate();
  }

  async compositionInsert(newString) {
    [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.insert(
      this.compositionIndex, this.compositionPosition, newString,
      this.state.editorMask
    );

    this.caretInfo.rangeSelect = false;
    await this.insertionUpdate();
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

    await this.insertionUpdate();
  }

  async insertionUpdate() {
    this.contentChanged = true;
    this.caret.removeCaretBlock();
    this.caretInfo.insideCaretBlock = false;

    await this.updateContent();
    this.caret.setInfo(this.caretInfo);
    await this.selectionChanged();
  }

  async updateContent() {
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
    this.caretInfo.editorSelected = true;

    const on = (this.state.editorMask & bit) === 0;
    const newToolbarMask = MaskManager.toolbarMergeBit(bit, on, this.state.editorMask);

    if(!this.caretInfo.rangeSelect) {
      const leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.index, this.caretInfo.position, false
      );

      this.caretInfo.insideCaretBlock = this.state.content[0].c.length === 0 ||
        newToolbarMask !== leftCharacterMask;
    }

    if(this.caretInfo.insideCaretBlock) {
      this.virtualTextEditor.addCaretBlock(
        this.caretInfo.index, this.caretInfo.position
      );
      await this.updateContent();
    }

    await this.updateMask(newToolbarMask);
    await this.rangeMaskUpdate(bit, on);

    this.caret.setInfo(this.caretInfo);
  }

  async selectionChanged() {
    this.updateCaretInfo();

    let potentialNewIndexAndPosition = this.virtualTextEditor.removeCaretBlock(
      this.caretInfo.index, this.caretInfo.position
    );

    if(potentialNewIndexAndPosition) {
      [ this.caretInfo.index, this.caretInfo.position ] = potentialNewIndexAndPosition;
      await this.updateContent();
    }

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

    if(!this.caretInfo.rangeSelect) {
      this.caret.setInfo(this.caretInfo);
    }
  }

  updateCaretInfo() {
    const newCaretInfo = this.caret.getInfo();
    this.caretInfo.editorSelected = true;

    /* Maintain previous info for the other selection type */
    if(newCaretInfo.rangeSelect) {
      this.caretInfo.leftIndex = newCaretInfo.leftIndex;
      this.caretInfo.leftPosition = newCaretInfo.leftPosition;
      this.caretInfo.rightIndex = newCaretInfo.rightIndex;
      this.caretInfo.rightPosition = newCaretInfo.rightPosition;
      this.caretInfo.rangeSelect = true;
      this.caretInfo.insideCaretBlock = false;
    }
    else {
      let [ correctIndex, correctPosition ] =
        this.virtualTextEditor.getCorrectedIndexAndPosition(
          newCaretInfo.index, newCaretInfo.position
        );

      if(this.state.content[0].c.length === 0) {
        newCaretInfo.insideCaretBlock = true;
      }

      this.caretInfo.index = correctIndex;
      this.caretInfo.position = correctPosition;
      this.caretInfo.rangeSelect = false;
      this.caretInfo.insideCaretBlock = newCaretInfo.insideCaretBlock;
    }
  }

  componentDidMount() {
    this.textEditor = document.getElementById(this.id);
    this.outerTextEditor = document.getElementById(this.id + '!');
    this.handleSelectionChange = registerEventHandlers(this);
  }

  componentDidUpdate() {
    if(!this.contentChanged) {
      return;
    }

    /* The rendered text must be manually sanitized */
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
      if(childElement.classList.contains('Askd-te-MATHJAX')) {
        continue;
      }

      if(childElement.innerHTML !== this.state.content[i].c) {
        childElement.childNodes[0].nodeValue = this.state.content[i].c;
      }
    }

    /* Callback with new content */
    if(this.props.onChange) {
      this.props.onChange(this.state.content);
    }

    this.contentChanged = false;
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  render() {
    let handleBlur = (event) => {
      /* Don't blur if this is one of the toolbar buttons or math block */
      if(event.relatedTarget) {
        let isIcon = event.relatedTarget.classList.contains('Askd-tb-icon') &&
           this.outerTextEditor.contains(event.relatedTarget);
        let mathBlock = this.caret.getContainingMathBlock(event.relatedTarget);

        if(isIcon || mathBlock) {
          return;
        }
      }

      if(this.caretInfo.editorSelected) {
        this.caretInfo.editorSelected = false;
        this.caret.removeCaretBlock();
        this.forceUpdate();
      }
    };

    return (
      <div className="Askd-text-editor" id={this.id + '!'}>
        <Toolbar mask={this.state.editorMask} callback={this.toolbarUpdate} />
        <TextEditorContent content={this.state.content} id={this.id}
                           editable={true} handleBlur={handleBlur}
                           handleFocus={this.handleSelectionChange}
                           caretInfo={this.caretInfo} />
      </div>
    );
  }
}

export default TextEditor;
