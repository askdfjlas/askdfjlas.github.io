import React, { Component } from 'react';
import TextEditor from '../TextEditor/TextEditor';
import SolvedState from './SolvedState';
import UserAuthApi from '../Api/UserAuthApi';
import NotesApi from '../Api/NotesApi';
import Utils from '../Utils';

class EditNoteForm extends Component {
  constructor(props) {
    super(props);

    const noteInfo = this.props.noteInfo;
    const problemInfo = this.props.problemInfo;

    this.title = noteInfo.title || `Notes for ${problemInfo.problemName}`;
    this.solved = noteInfo.solved;
    this.content = JSON.parse(noteInfo.content);

    this.state = {
      published: noteInfo.published
    };

    this.saveNote = this.saveNote.bind(this);
    this.togglePublishNote = this.togglePublishNote.bind(this);
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
    await Utils.setStatePromise(this, {
      published: published
    });
  }

  async saveNote() {
    await this.saveOrPublishNote(this.state.published);
  }

  async togglePublishNote() {
    await this.saveOrPublishNote(!this.state.published);
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
    const togglePublishText = this.state.published ? 'Unpublish' : 'Publish!';

    return (
      <div className="Edit-note-form Askd-form">
        <input className="Edit-note-title" name="title" type="text"
               defaultValue={this.title} placeholder="Title"
               onChange={this.handleTitleChange} />
        <select name="solved" id="note-solved" onChange={this.handleSolvedChange}
                defaultValue={this.solved}>
          <option value={SolvedState.SOLVED}>Solved</option>
          <option value={SolvedState.UPSOLVED}>Upsolved</option>
          <option value={SolvedState.UPSOLVED_HELP}>Upsolved with help</option>
          <option value={SolvedState.UNSOLVED}>Unsolved</option>
        </select>
        <TextEditor initialContent={this.content}
                    onChange={this.handleContentChange} />
        <div className="Edit-note-bottom-buttons">
          <input className="Askd-button Askd-not-fullwidth"
                 type="button" value="Save" onClick={this.saveNote} />
          <input className="Askd-button Askd-not-fullwidth"
                 type="button" value={togglePublishText}
                 onClick={this.togglePublishNote} />
        </div>
      </div>
    );
  }
}

export default EditNoteForm;
