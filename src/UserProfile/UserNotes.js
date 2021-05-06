import React, { Component } from 'react';
import AddProblemForm from './AddProblemForm';
import NotesApi from '../Api/NotesApi';
import LocalStorageApi from '../Api/LocalStorageApi';
import UserNotesList from './UserNotesList';
import Utils from '../Utils';
import '../css/UserNotes.css';

class UserNotes extends Component {
  constructor(props) {
    super(props);

    this.viewPreferences = LocalStorageApi.getNoteViewPreferences();

    this.state = {
      showAddProblemForm: false,
      ...this.viewPreferences
    };

    this.toggleAddProblemForm = this.toggleAddProblemForm.bind(this);
    this.toggleOrganizeBySolved = this.toggleOrganizeBySolved.bind(this);
    this.toggleOrganizeByPlatform = this.toggleOrganizeByPlatform.bind(this);
    this.toggleOrganizeByContest = this.toggleOrganizeByContest.bind(this);
    this.toggleSortByRecent = this.toggleSortByRecent.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  updateViewPreferences() {
    LocalStorageApi.setNoteViewPreferences({
      sortByRecent: this.state.sortByRecent,
      organizeBySolved: this.state.organizeBySolved,
      organizeByPlatform: this.state.organizeByPlatform,
      organizeByContest: this.state.organizeByContest
    });
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
    this.updateViewPreferences();
  }

  async toggleOrganizeByPlatform() {
    await Utils.setStatePromise(this, {
      organizeByPlatform: !this.state.organizeByPlatform
    });
    this.updateViewPreferences();
  }

  async toggleOrganizeByContest() {
    await Utils.setStatePromise(this, {
      organizeByContest: !this.state.organizeByContest
    });
    this.updateViewPreferences();
  }

  async toggleSortByRecent() {
    await Utils.setStatePromise(this, {
      sortByRecent: !this.state.sortByRecent
    });
    this.updateViewPreferences();
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
    const sortDefault = this.viewPreferences.sortByRecent ? 'recent' : 'default';

    return (
      <>
        {
          this.state.showAddProblemForm &&
          <AddProblemForm callback={this.addProblem} />
        }
        <div className="User-notes-outer Module-outer-space">
          <h2 className="Module-heading">Notes</h2>
          <form>
            <div className="Small-organize User-notes-organize">
              <label>
                Organize by
              </label>
              <input type="checkbox" name="solved" value="solved"
                     checked={this.state.organizeBySolved}
                     onChange={this.toggleOrganizeBySolved} />
              <label htmlFor="solved">Solved</label>
              <input type="checkbox" name="platform" value="platform"
                     checked={this.state.organizeByPlatform}
                     onChange={this.toggleOrganizeByPlatform} />
              <label htmlFor="platform">Platform</label>
              <input type="checkbox" name="contest" value="contest"
                     checked={this.state.organizeByContest}
                     onChange={this.toggleOrganizeByContest} />
              <label htmlFor="contest">Contest</label>
            </div>
            <div className="Small-organize User-notes-organize">
              <label htmlFor="sort">
                Sort by
              </label>
              <select defaultValue={sortDefault} name="sort"
                      onChange={this.toggleSortByRecent}>
                <option value="recent">Recent</option>
                <option value="default">Alphabetical</option>
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
                <span className="icon-plus" />
              </button>
            }
          </div>
        </div>
      </>
    );
  }
}

export default UserNotes;
