import React, { Component } from 'react';
import Api from './Api';
import CpProblem from './CpProblem';
import CpForm from './CpForm';
import Utils from './Utils';
import './css/CpNotes.css';

class CpNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problems: Api.getProblems(),
      showForm: false
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  async toggleForm() {
    await Utils.setStatePromise(this, {
      showForm: !this.state.showForm
    });
  }

  async addProblem(problem) {
    this.toggleForm();

    if(!problem)
      return;

    const uuid = Api.addProblem(problem);
    var updatedProblems = this.state.problems;
    updatedProblems[uuid] = problem;

    await Utils.setStatePromise(this, {
      problems: updatedProblems
    });
    await window.MathJax.typesetPromise();
  }

  render() {
    var problemElements = [];
    for(const uuid in this.state.problems) {
      problemElements.push(
        <CpProblem key={uuid} problem={this.state.problems[uuid]} />
      );
    }

    return (
      <div className="Module-wrapper">
        <div className="Module-description">
          <h2>Competitive Programming Notes</h2>
          <p>It's difficult to keep track of unsolved problems in competitive programming.
          Personally, I've always tried to maintain a mental queue of these problems in my head,
          only to later forget about them. This small tool allows you to have this
          list in your browser's localstorage, and also supports note-taking. Math rendering
          is done using MathJax! For example, typing \\(x \geq 4\\) will produce the following:
          \(x \geq 4\)</p>
        </div>
        <div className="Cp-notes Module-space">
          {
            Utils.isEmpty(this.state.problems) ?
              <p className="Cp-notes-none">It looks like you haven't added any problems yet.
              Click the '+' button in the bottom-right to add one.</p> :
              problemElements
          }
          {
            this.state.showForm && <CpForm callback={this.addProblem} />
          }
          <button onClick={this.toggleForm}
                  className="Cp-notes-add Askd-button Askd-button-circular">
                  +
          </button>
        </div>
      </div>
    );
  }
}

export default CpNotes;
