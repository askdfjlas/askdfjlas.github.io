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
    this.caret.setInfo(this.caretInfo, this.state.editorMask);
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

      let previouslyInsideCaretBlock = this.caretInfo.insideCaretBlock;
      this.caretInfo.insideCaretBlock = newToolbarMask !== leftCharacterMask ||
        this.virtualTextEditor.atBlockNewlineEnd(
          this.caretInfo.index, this.caretInfo.position
        );

      if(this.caretInfo.insideCaretBlock) {
        this.virtualTextEditor.addCaretBlock(
          this.caretInfo.index, this.caretInfo.position
        );
        await this.updateContent();
      }
      else {
        if(previouslyInsideCaretBlock) {
          this.virtualTextEditor.removeCaretBlock();
          await this.updateContent();
        }
      }

      await this.updateMask(newToolbarMask);
      this.caret.setInfo(this.caretInfo, this.state.editorMask);
    }
    else {
      await this.rangeMaskUpdate(bit, on);
    }
  }

  async selectionChanged() {
    let previouslyInsideCaretBlock = this.caretInfo.insideCaretBlock;
    this.updateCaretInfo();

    if(previouslyInsideCaretBlock) {
      this.virtualTextEditor.removeCaretBlock(this.caretInfo);
      this.caret.removeCaretBlock();
      await this.updateContent();
      this.caret.setInfo(this.caretInfo, this.state.editorMask);
    }

    if(this.caretInfo.rangeSelect) {
      let updateCaret = false;
      let leftElement = document.getElementById(this.id + this.caretInfo.leftIndex);
      let rightElement = document.getElementById(this.id + this.caretInfo.rightIndex);

      let leftElementLength = this.state.content[this.caretInfo.leftIndex].c.length;
      let atLeftElementEnd = (this.caretInfo.leftPosition === leftElementLength);
      let atRightElementBegin = (this.caretInfo.rightPosition === 0);

      if(leftElement.classList.contains('Askd-te-MATHJAX') && !atLeftElementEnd)
        updateCaret = true;
      if(rightElement.classList.contains('Askd-te-MATHJAX') && !atRightElementBegin)
        updateCaret = true;

      let leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.leftIndex, this.caretInfo.leftPosition, true
      );
      await this.updateMask(leftCharacterMask);

      if(updateCaret) {
        this.caret.setInfo(this.caretInfo, this.state.editorMask);
      }
    }
    else {
      let leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.index, this.caretInfo.position, false
      );
      await this.updateMask(leftCharacterMask);
      this.caret.setInfo(this.caretInfo, this.state.editorMask);
    }
  }

  updateCaretInfo() {
    const newCaretInfo = this.caret.getInfo();
    this.caretInfo.editorSelected = true;

    /* Maintain previous info for the other selection type */
    if(newCaretInfo.rangeSelect) {
      [ this.caretInfo.leftIndex, this.caretInfo.leftPosition ] =
        this.virtualTextEditor.getCorrectedIndexAndPosition(
          newCaretInfo.leftIndex, newCaretInfo.leftPosition, false
        );

      [ this.caretInfo.rightIndex, this.caretInfo.rightPosition ] =
        this.virtualTextEditor.getCorrectedIndexAndPosition(
          newCaretInfo.rightIndex, newCaretInfo.rightPosition, true
        );

      this.caretInfo.rangeSelect = true;
      this.caretInfo.insideCaretBlock = false;
    }
    else {
      [ this.caretInfo.index, this.caretInfo.position ] =
        this.virtualTextEditor.getCorrectedIndexAndPosition(
          newCaretInfo.index, newCaretInfo.position, false
        );

      if(this.virtualTextEditor.atBlockNewlineEnd(
        this.caretInfo.index, this.caretInfo.position
      )) {
        newCaretInfo.insideCaretBlock = true;
      }

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
      /* Don't blur if event.relatedTarget is one of the toolbar buttons or
      contained within the 'textarea' */
      if(event.relatedTarget) {
        let isIcon = event.relatedTarget.classList.contains('Askd-tb-icon') &&
           this.outerTextEditor.contains(event.relatedTarget);
        let contained = this.textEditor.contains(event.relatedTarget);

        if(isIcon || contained) {
          return;
        }
      }

      if(this.caretInfo.editorSelected) {
        this.caretInfo.editorSelected = false;
        if(this.caretInfo.insideCaretBlock) {
          this.caretInfo.insideCaretBlock = false;
          this.caret.removeCaretBlock();
          this.virtualTextEditor.removeCaretBlock();
          this.updateContent();
        }
        else {
          this.forceUpdate();
        }
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
