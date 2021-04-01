import React, { Component } from 'react';
import Caret from './Caret';
import Toolbar from './Toolbar';
import VirtualTextEditor from './VirtualTextEditor';
import TextEditorContent from './TextEditorContent';
import ContentType from './ContentType';
import MaskManager from './MaskManager';
import Utils from '../Utils';
import registerEventHandlers from './registerEventHandlers';
import sanitizeTextArea from './sanitizeTextArea';
import { v4 as uuidv4 } from 'uuid';
import '../css/TextEditor.css';

class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.id = `Askd-text-editor-${uuidv4()}`;
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
    this.blockUpdate = this.blockUpdate.bind(this);
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

  async insert(newString, useLastKnownCaretInfo) {
    if(!useLastKnownCaretInfo) {
      this.updateCaretInfo();
    }

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

  async imageInsert() {
    if(!this.caretInfo.rangeSelect) {
      /* Always add a newline preceding an image */
      [ this.caretInfo.index, this.caretInfo.position ] = this.virtualTextEditor.insert(
        this.caretInfo.index, this.caretInfo.position,
        String.fromCharCode(10), this.state.editorMask
      );

      [ this.caretInfo.index, this.caretInfo.position] = this.virtualTextEditor.insert(
        this.caretInfo.index, this.caretInfo.position, '!', ContentType.IMAGE
      );

      await this.insertionUpdate();
    }
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
    await this.checkCaretNextToImage();

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
    if(bit === ContentType.IMAGE) {
      this.imageInsert();
      return;
    }

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
      else if(previouslyInsideCaretBlock) {
        this.virtualTextEditor.removeCaretBlock();
        await this.updateContent();
      }

      await this.updateMask(newToolbarMask);
      this.caret.setInfo(this.caretInfo, this.state.editorMask);
    }
    else {
      await this.rangeMaskUpdate(bit, on);
    }
  }

  async blockUpdate(params) {
    /* When an image block gets clicked, the selectionchange handler should be
    temporarily disabled, since it can't tell that the thing which got clicked
    on should be counted as outside of the textarea. When the block gets
    blurred, selectionchange should be re-enabled. */
    if(params.disableSelectionChange === true) {
      this.disableSelectionChange = true;
    }
    else if(params.disableSelectionChange === false) {
      this.disableSelectionChange = false;
    }

    if(params.imageUpdate) {
      this.virtualTextEditor.updateImageLink(
        params.imageUpdate.index, params.imageUpdate.link
      );

      if(this.props.onChange) {
        this.props.onChange(this.virtualTextEditor.getContent());
      }

      await this.updateContent();
    }
  }

  async checkCaretNextToImage() {
    if(!this.caretInfo.rangeSelect) {
      const leftCharacterMask = this.virtualTextEditor.getCharacterMask(
        this.caretInfo.index, this.caretInfo.position, false
      );

      if(leftCharacterMask & ContentType.IMAGE) {
        this.caretInfo.insideCaretBlock = true;
        this.virtualTextEditor.addCaretBlock(
          this.caretInfo.index, this.caretInfo.position, 0
        );

        await this.updateContent();
        this.caret.setInfo(this.caretInfo, 0);
      }
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

    /* If the caret is in front of an image, set the mask to 0, and see if
    adding a caret block is necessary */
    if(leftCharacterMask & ContentType.IMAGE) {
      leftCharacterMask = 0;
      await this.checkCaretNextToImage();
    }

    await this.updateMask(leftCharacterMask);

    if(!this.caretInfo.rangeSelect) {
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
    [ this.handleSelectionChange, this.handleBlur ] = registerEventHandlers(this);

    if(this.props.focusOnMount) {
      this.textEditor.focus();
    }
  }

  componentDidUpdate() {
    if(!this.contentChanged) {
      return;
    }

    sanitizeTextArea(this.textEditor, this.state.content);

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
    return (
      <div className="Askd-text-editor" id={this.id + '!'}>
        <Toolbar mask={this.state.editorMask} callback={this.toolbarUpdate} />
        <TextEditorContent content={this.state.content} id={this.id}
                           editable={true} handleBlur={this.handleBlur}
                           handleFocus={this.handleSelectionChange}
                           handleBlockUpdate={this.blockUpdate}
                           caretInfo={this.caretInfo} />
      </div>
    );
  }
}

export default TextEditor;
