import React, { Component } from 'react';
import AddProblemForm from './AddProblemForm';
import NotesApi from '../Api/NotesApi';
import Utils from '../Utils';

class UserProblems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProblemForm: false
    };

    this.toggleAddProblemForm = this.toggleAddProblemForm.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  async toggleAddProblemForm() {
    Utils.setStatePromise(this, {
      showAddProblemForm: !this.state.showAddProblemForm
    });
  }

  async addProblem(problemSortKey, platform, formComponent) {
    if(!problemSortKey) {
      await this.toggleAddProblemForm();
      return;
    }

    try {
      const username = this.props.info.username;
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
        <div className="Cp-notes Module-space">
          <p>There's nothing to see here yet!</p>
          {
            this.props.info.email &&
            <button onClick={this.toggleAddProblemForm}
                    className="Cp-notes-add Askd-button Askd-button-circular">
              +
            </button>
          }
        </div>
      </>
    );
  }
}

export default UserProblems;
