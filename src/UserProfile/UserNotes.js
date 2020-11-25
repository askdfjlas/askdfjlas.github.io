import React, { Component } from 'react';
import AddProblemForm from './AddProblemForm';
import NotesApi from '../Api/NotesApi';
import UserNotesList from './UserNotesList';
import Utils from '../Utils';
import '../css/UserNotes.css';

class UserNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProblemForm: false,
      organizeBySolved: false,
      organizeByContest: false
    };

    this.toggleAddProblemForm = this.toggleAddProblemForm.bind(this);
    this.toggleOrganizeBySolved = this.toggleOrganizeBySolved.bind(this);
    this.toggleOrganizeByContest = this.toggleOrganizeByContest.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  async toggleAddProblemForm() {
    await Utils.setStatePromise(this, {
      showAddProblemForm: !this.state.showAddProblemForm
    });
  }

  async toggleOrganizeBySolved() {
    await Utils.setStatePromise(this, {
      organizeBySolved: !this.state.organizeBySolved
    });
  }

  async toggleOrganizeByContest() {
    await Utils.setStatePromise(this, {
      organizeByContest: !this.state.organizeByContest
    });
  }

  async addProblem(problemSortKey, platform, formComponent) {
    if(!problemSortKey) {
      await this.toggleAddProblemForm();
      return;
    }

    try {
      const username = this.props.userInfo.username;
      await NotesApi.addNote(username, platform, problemSortKey);

      const problemUrl = problemSortKey.replace('#', '/');
      this.props.history.push(`/notes/edit/${platform}/${problemUrl}`);
    }
    catch(err) {
      await Utils.componentSetError(formComponent, err.message);
    }
  }

  render() {
    return (
      <>
        <h2 className="Module-heading">Problems</h2>
        {
          this.state.showAddProblemForm &&
          <AddProblemForm callback={this.addProblem} />
        }
        <form>
          <div className="User-notes-organize">
            <label>
              <b>Organize by</b>
            </label>
            <input type="checkbox" name="solved" value="solved"
                   onChange={this.toggleOrganizeBySolved} />
            <label htmlFor="solved">Solved</label>
            <input type="checkbox" name="contest" value="contest"
                   onChange={this.toggleOrganizeByContest} />
            <label htmlFor="contest">Contest</label>
          </div>
        </form>
        <div className="User-notes Module-space">
          <UserNotesList organizeBySolved={this.state.organizeBySolved}
                         organizeByContest={this.state.organizeByContest}
                         notes={this.props.notes} />
          {
            this.props.userInfo.email &&
            <button onClick={this.toggleAddProblemForm}
                    className="User-notes-add Askd-button Askd-button-circular">
              +
            </button>
          }
        </div>
      </>
    );
  }
}

export default UserNotes;
