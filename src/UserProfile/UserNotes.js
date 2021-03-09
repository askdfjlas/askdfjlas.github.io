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
      organizeByPlatform: false,
      organizeByContest: false,
      sortByRecent: false
    };

    this.toggleAddProblemForm = this.toggleAddProblemForm.bind(this);
    this.toggleOrganizeBySolved = this.toggleOrganizeBySolved.bind(this);
    this.toggleOrganizeByPlatform = this.toggleOrganizeByPlatform.bind(this);
    this.toggleOrganizeByContest = this.toggleOrganizeByContest.bind(this);
    this.toggleSortByRecent = this.toggleSortByRecent.bind(this);
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

  async toggleOrganizeByPlatform() {
    await Utils.setStatePromise(this, {
      organizeByPlatform: !this.state.organizeByPlatform
    });
  }

  async toggleOrganizeByContest() {
    await Utils.setStatePromise(this, {
      organizeByContest: !this.state.organizeByContest
    });
  }

  async toggleSortByRecent() {
    await Utils.setStatePromise(this, {
      sortByRecent: !this.state.sortByRecent
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
      await formComponent.setLoading(false);
    }
  }

  render() {
    return (
      <>
        {
          this.state.showAddProblemForm &&
          <AddProblemForm callback={this.addProblem} />
        }
        <div className="User-notes-outer Module-outer-space">
          <h2 className="Module-heading">Notes</h2>
          <form>
            <div className="User-notes-organize">
              <label>
                <b>Organize by</b>
              </label>
              <input type="checkbox" name="solved" value="solved"
                     onChange={this.toggleOrganizeBySolved} />
              <label htmlFor="solved">Solved</label>
              <input type="checkbox" name="platform" value="platform"
                     onChange={this.toggleOrganizeByPlatform} />
              <label htmlFor="platform">Platform</label>
              <input type="checkbox" name="contest" value="contest"
                     onChange={this.toggleOrganizeByContest} />
              <label htmlFor="contest">Contest</label>
            </div>
            <div className="User-notes-organize">
              <label htmlFor="sort">
                <b>Sort by</b>
              </label>
              <select defaultValue="default" name="sort"
                      onChange={this.toggleSortByRecent}>
                <option value="default">Default</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </form>
          <div className="User-notes Module-space">
            <UserNotesList organizeBySolved={this.state.organizeBySolved}
                           organizeByPlatform={this.state.organizeByPlatform}
                           organizeByContest={this.state.organizeByContest}
                           sortByRecent={this.state.sortByRecent}
                           notes={this.props.notes} />
            {
              this.props.userInfo.email &&
              <button onClick={this.toggleAddProblemForm}
                      className="User-notes-add Askd-button Askd-button-circular">
                +
              </button>
            }
          </div>
        </div>
      </>
    );
  }
}

export default UserNotes;
