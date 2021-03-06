import React, { Component } from 'react';
import { Prompt } from 'react-router';
import { Link } from 'react-router-dom';
import TextEditor from '../TextEditor/TextEditor';
import DeleteMenu from '../Misc/DeleteMenu';
import SolvedState from '../Enum/SolvedState';
import NotesApi from '../Api/NotesApi';
import Utils from '../Utils';

function remindUserToSave(event) {
  event.preventDefault();
  event.returnValue = '';
}

class EditNoteForm extends Component {
  constructor(props) {
    super(props);

    const noteInfo = this.props.noteInfo;
    this.title = noteInfo.title;
    this.solved = noteInfo.solved;
    this.content = JSON.parse(noteInfo.content);
    this.lastSaved = new Date(noteInfo.editedTime);

    const username = noteInfo.username
    const platform = this.props.platform;
    const problemId = noteInfo.problemInfo.problemId;
    const problemUrl = problemId.split('#').join('/');
    this.publishedUrl = `/notes/${username}/${platform}/${problemUrl}`;

    this.state = {
      published: noteInfo.published,
      disableEditButtons: false,
      saved: true,
      loadingSave: false,
      loadingPublish: false,
      showDeleteMenu: false
    };

    this.saveNote = this.saveNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.togglePublishNote = this.togglePublishNote.bind(this);
    this.toggleDeleteMenu = this.toggleDeleteMenu.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSolvedChange = this.handleSolvedChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  async saveOrPublishNote(published) {
    const username = this.props.noteInfo.username;
    const platform = this.props.platform;
    const problemId = this.props.noteInfo.problemInfo.problemId;
    const title = this.title;
    const solved = this.solved;
    const content = this.content;

    await NotesApi.editNote(username, platform, problemId, title, solved,
                            content, published);

    await this.setSaved(true);
    await Utils.setStatePromise(this, {
      published: published,
      disableEditButtons: false,
      loadingSave: false,
      loadingPublish: false
    });

    if(published) {
      this.props.history.push(this.publishedUrl);
    }
  }

  async saveNote(event) {
    await Utils.setStatePromise(this, {
      disableEditButtons: true,
      loadingSave: true
    });

    await this.saveOrPublishNote(this.state.published);
  }

  async deleteNote() {
    const username = this.props.noteInfo.username;
    const platform = this.props.platform;
    const problemId = this.props.noteInfo.problemInfo.problemId;

    await NotesApi.deleteNote(username, platform, problemId);
    await this.setSaved(true);
    this.props.history.push(`/users/${username}`);
  }

  async togglePublishNote(event) {
    await Utils.setStatePromise(this, {
      disableEditButtons: true,
      loadingPublish: true
    });

    await this.saveOrPublishNote(!this.state.published);
  }

  async toggleDeleteMenu(event) {
    await Utils.setStatePromise(this, {
      showDeleteMenu: !this.state.showDeleteMenu
    });
  }

  async setSaved(saved) {
    if(!saved && this.state.saved) {
      await Utils.setStatePromise(this, {
        saved: false
      });
      window.onbeforeunload = remindUserToSave;
    }
    else if(saved && !this.state.saved) {
      this.lastSaved = new Date();
      await Utils.setStatePromise(this, {
        saved: true
      });
      window.onbeforeunload = null;
    }
  }

  handleTitleChange(event) {
    this.title = event.target.value;
    this.setSaved(false);
  }

  handleSolvedChange(event) {
    this.solved = event.target.value;
    this.setSaved(false);
  }

  handleContentChange(newContent) {
    this.content = newContent;
    this.setSaved(false);
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
    this.mounted = false;
  }

  render() {
    let savedText = this.state.saved ? 'All changes saved! - ' : 'Last saved on ';
    savedText += this.lastSaved.toLocaleString();

    const togglePublishText = this.state.published ? 'Unpublish' : 'Publish!';
    let saveButtonClass = 'Askd-button Askd-not-fullwidth';
    let publishButtonClass = 'Askd-button Askd-not-fullwidth';

    if(this.state.loadingSave) saveButtonClass += ' Askd-form-loading';
    if(this.state.loadingPublish) publishButtonClass += ' Askd-form-loading';

    return (
      <>
        <Prompt when={!this.state.saved}
                message='Are you sure you want to leave? You have unsaved changes.' />
        {
          this.state.showDeleteMenu &&
          <DeleteMenu exitCallback={this.toggleDeleteMenu}
                      deleteCallback={this.deleteNote} entityName="note" />
        }
        <form className="Edit-note-form Askd-form Module-outer-space">
          <input className="Edit-note-title" name="title" type="text"
                 defaultValue={this.title} placeholder="Title"
                 onChange={this.handleTitleChange} />

          <select name="solved" id="note-solved" onChange={this.handleSolvedChange}
                  defaultValue={this.solved}>
            <option value={SolvedState.SOLVED.value}>Solved</option>
            <option value={SolvedState.UPSOLVED.value}>Upsolved</option>
            <option value={SolvedState.UPSOLVED_HELP.value}>Upsolved with help</option>
            <option value={SolvedState.UNSOLVED.value}>Unsolved</option>
          </select>

          <TextEditor initialContent={this.content}
                      onChange={this.handleContentChange} />
          {
            this.state.published &&
            <Link className="Edit-note-published-link Askd-form-link"
                  to={this.publishedUrl}>
              See published page
            </Link>
          }
          <p className="Edit-note-saved-text">{savedText}</p>
          <div className="Edit-note-bottom-buttons">
            <input className={saveButtonClass} type="button" value="Save"
                   onClick={this.saveNote}
                   disabled={this.state.disableEditButtons} />

            <input className={publishButtonClass} type="button"
                   value={togglePublishText} onClick={this.togglePublishNote}
                   disabled={this.state.disableEditButtons} />
          </div>
          <div className="Edit-note-delete">
            <button type="button" className="Askd-form-link Askd-form-link-bottom"
                    onClick={this.toggleDeleteMenu}>
              Permanently delete this note?
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default EditNoteForm;
