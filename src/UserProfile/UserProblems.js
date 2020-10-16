import React, { Component } from 'react';
import AddProblemForm from './AddProblemForm';
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

  async addProblem(problemKey) {
    await this.toggleAddProblemForm();
    if(!problemKey)
      return;
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
