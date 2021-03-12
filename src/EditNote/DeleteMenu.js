import React, { Component } from 'react';
import UserAuthApi from '../Api/UserAuthApi';
import NotesApi from '../Api/NotesApi';
import Utils from '../Utils';
import { v4 as uuidv4 } from 'uuid';

class DeleteMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    };
    this.randomCode = uuidv4();

    this.close = this.close.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  close() {
    this.props.exitCallback();
  }

  async deleteNote(event) {
    event.preventDefault();

    const confirmCode = event.target.confirmCode.value;
    if(confirmCode !== this.randomCode) {
      await Utils.componentSetError(this, "Your confirmation code doesn't match!");
      return;
    }

    try {
      const username = await UserAuthApi.getUsername();
      const platform = this.props.platform;
      const problemId = this.props.problemInfo.problemId;

      await this.setLoading(true);
      await NotesApi.deleteNote(username, platform, problemId);
      this.props.history.push(`/users/${username}`);
    }
    catch(err) {
      await Utils.componentSetError(this, err.message);
      await this.setLoading(false);
    }
  }

  async setLoading(isLoading) {
    await Utils.setStatePromise(this, {
      loading: isLoading
    });
  }

  render() {
    let submitButtonClassName = 'Askd-button';
    if(this.state.loading) {
      submitButtonClassName += ' Askd-form-loading';
    }

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular" />
        <div className="Edit-note-delete-menu Module-popup">
          { this.state.error && <h2>{this.state.error}</h2> }
          <h2>Are you sure you want to permanently delete this note?</h2>
          <p>
            This action cannot be undone! Please enter the following
            code as confirmation.
          </p>
          <form className="Askd-form" onSubmit={this.deleteNote}>
            <label htmlFor="confirmCode">{this.randomCode}</label>
            <input autoComplete="off" type="text" name="confirmCode"
                   key="confirmCode" id="confirmCode" />

            <input className={submitButtonClassName} type="submit" value="Delete"
                   disabled={this.state.loading} />
          </form>
        </div>
      </div>
    );
  }
}

export default DeleteMenu;
