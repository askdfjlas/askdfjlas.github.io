import React, { Component } from 'react';
import Utils from '../Utils';
import SearchSelect from '../SearchSelect/SearchSelect';
import ProblemsApi from '../Api/ProblemsApi';
import '../css/CpForm.css';

class CpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platform: null,
      problemSortKey: null
    };

    this.close = this.close.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.updateProblemSortKey = this.updateProblemSortKey.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  close() {
    this.props.callback(null);
  }

  async handlePlatformChange(event) {
    await Utils.setStatePromise(this, {
      platform: event.target.value
    });
  }

  async updateProblemSortKey(sortKey) {
    await Utils.setStatePromise(this, {
      problemSortKey: sortKey
    });
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
      notes: form.notes.value,
      sortKey: this.state.problemSortKey
    };

    await this.props.callback(problem);
  }

  render() {
    const disableForm = !this.state.platform;

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular">X</button>
        <div className="Cp-form Module-popup">
          <form className="Askd-form" onSubmit={this.addProblem}>
            <label htmlFor="cp-platform">Platform</label>
            <select defaultValue="" onChange={this.handlePlatformChange} name="platform" id="cp-platform">
              <option disabled value=""></option>
              <option value="CodeForces">CodeForces</option>
              <option value="CodeChef">CodeChef</option>
            </select>

            <label htmlFor="cp-title">Problem title</label>
            <SearchSelect name='title' id='cp-title' search={ProblemsApi.getProblems}
                          searchKey={this.state.platform} keys={['code', 'title']}
                          callback={this.updateProblemSortKey} />

            <label htmlFor="cp-link">Problem link</label>
            <div className="Askd-form-inline">
              <span>https://</span>
              <input autoComplete="off" type="text" name="link" id="cp-link"
                     disabled={disableForm} />
            </div>

            <label htmlFor="cp-code">Problem code (e.g. 1401E)</label>
            <input autoComplete="off" type="text" name="code" id="cp-code"
                   disabled={disableForm} />

            <label htmlFor="cp-solved">Solved?</label>
            <select name="solved" id="cp-solved" disabled={disableForm}>
              <option value="0">Unsolved</option>
              <option value="1">Solved</option>
              <option value="2">Solved with help</option>
            </select>

            <label htmlFor="cp-math-notes">Notes</label>
            <textarea autoComplete="off" name="notes" id="cp-math-notes"
                      disabled={disableForm} />

            <input className="Askd-button Module-popup-last" type="submit"
                   value="Add" />
          </form>
        </div>
      </div>
    );
  }
}

export default CpForm;
