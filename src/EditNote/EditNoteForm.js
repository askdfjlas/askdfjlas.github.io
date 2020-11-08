import React, { Component } from 'react';
import TextEditor from '../TextEditor/TextEditor';
import SolvedState from './SolvedState';
import UserAuthApi from '../Api/UserAuthApi';
import NotesApi from '../Api/NotesApi';

class EditNoteForm extends Component {
  constructor(props) {
    super(props);

    this.title = `Notes for ${this.props.problemInfo.problemName}`;
    this.solved = '' + SolvedState.SOLVED;
    this.content = [];

    this.saveNote = this.saveNote.bind(this);
    this.publishNote = this.publishNote.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSolvedChange = this.handleSolvedChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  async saveOrPublishNote(published) {
    const username = await UserAuthApi.getUsername();
    const platform = this.props.platform;
    const problemId = this.props.problemInfo.problemId;
    const title = this.title;
    const solved = this.solved;
    const content = JSON.stringify(this.content);

    await NotesApi.editNote(username, platform, problemId, title, solved,
                            content, published);
  }

  async saveNote() {
    await this.saveOrPublishNote(false);  // Boolean temporary
  }

  async publishNote() {
    await this.saveOrPublishNote(true);  // Boolean temporary
  }

  handleTitleChange(event) {
    this.title = event.target.value;
  }

  handleSolvedChange(event) {
    this.solved = event.target.value;
  }

  handleContentChange(newContent) {
    this.content = newContent;
  }

  render() {
    const defaultTitle = this.title;

    return (
      <div className="Edit-note-form Askd-form">
        <input className="Edit-note-title" name="title" type="text"
               defaultValue={defaultTitle} placeholder="Title"
               onChange={this.handleTitleChange} />
        <select name="solved" id="note-solved" onChange={this.handleSolvedChange}>
          <option value={SolvedState.SOLVED}>Solved</option>
          <option value={SolvedState.UPSOLVED}>Upsolved</option>
          <option value={SolvedState.UPSOLVED_HELP}>Upsolved with help</option>
          <option value={SolvedState.UNSOLVED}>Unsolved</option>
        </select>
        <TextEditor onChange={this.handleContentChange} />
        <div className="Edit-note-bottom-buttons">
          <input className="Askd-button Askd-not-fullwidth"
                 type="button" value="Save" onClick={this.saveNote} />
          <input className="Askd-button Askd-not-fullwidth"
                 type="button" value="Publish!" onClick={this.publishNote} />
        </div>
      </div>
    );
  }
}

export default EditNoteForm;
