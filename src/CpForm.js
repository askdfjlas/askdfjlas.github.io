import React, { Component } from 'react';
import './css/CpForm.css';

class CpForm extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  close() {
    this.props.callback(null);
  }

  async addProblem(event) {
    event.preventDefault();

    const form = event.target;
    const problem = {
      title: form.title.value,
      platform: form.platform.value,
      link: form.link.value,
      code: form.code.value,
      solved: form.solved.value,
      notes: form.notes.value
    };

    await this.props.callback(problem);
  }

  render() {
    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Cp-form-close Askd-button Askd-button-circular">X</button>
        <div className="Cp-form">
          <form className="Askd-form" onSubmit={this.addProblem}>
            <label className="Askd-form-required" htmlFor="cp-title">Problem title</label>
            <input autoComplete="off" type="text" name="title" id="cp-title" />

            <label htmlFor="cp-platform">Platform (e.g. CodeForces)</label>
            <input autoComplete="off" type="text" name="platform" id="cp-platform" />

            <label htmlFor="cp-link">Problem link</label>
            <div className="Askd-form-inline">
              <span>https://</span>
              <input autoComplete="off" type="text" name="link" id="cp-link" />
            </div>

            <label htmlFor="cp-code">Problem code (e.g. 1401E)</label>
            <input autoComplete="off" type="text" name="code" id="cp-code" />

            <label htmlFor="cp-solved">Solved?</label>
            <select name="solved" id="cp-solved">
              <option value="0">Unsolved</option>
              <option value="1">Solved</option>
              <option value="2">Solved with help</option>
            </select>

            <label htmlFor="cp-math-notes">Notes</label>
            <textarea autoComplete="off" name="notes" id="cp-math-notes" />

            <input className="Askd-button" type="submit" value="Add" />
          </form>
        </div>
      </div>
    );
  }
}

export default CpForm;
