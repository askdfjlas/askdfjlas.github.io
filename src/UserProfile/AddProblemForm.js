import React, { Component } from 'react';
import Utils from '../Utils';
import SearchSelect from '../SearchSelect/SearchSelect';
import ProblemsApi from '../Api/ProblemsApi';
import '../css/AddProblemForm.css';

class AddProblemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platform: null,
      contestSortKey: null,
      problemSortKey: null
    };

    this.close = this.close.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.updateProblemSortKey = this.updateProblemSortKey.bind(this);
    this.updateContestSortKey = this.updateContestSortKey.bind(this);
  }

  close() {
    this.props.callback(null);
  }

  async handlePlatformChange(event) {
    await Utils.setStatePromise(this, {
      platform: event.target.value
    });
  }

  async updateContestSortKey(sortKey) {
    await Utils.setStatePromise(this, {
      contestSortKey: sortKey
    });
  }

  async updateProblemSortKey(sortKey) {
    await Utils.setStatePromise(this, {
      problemSortKey: sortKey
    });
  }

  render() {
    var searchContestFunction = null;
    var searchContestKey = null;
    if(this.state.platform) {
      searchContestFunction = () => ProblemsApi.getContests(this.state.platform);
      searchContestKey = this.state.platform;
    }

    var searchProblemFunction = null;
    var searchProblemKey = null;
    if(this.state.platform && this.state.contestSortKey) {
      searchProblemFunction = () =>
        ProblemsApi.getProblems(this.state.platform, this.state.contestSortKey);
      searchProblemKey = this.state.platform + this.state.contestSortKey;
    }

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular">
                X
        </button>
        <div className="Add-problem-form Module-popup">
          <h2>Add a problem!</h2>
          <form className="Askd-form" onSubmit={this.addProblem}>
            <label htmlFor="cp-platform">Platform</label>
            <select defaultValue="" onChange={this.handlePlatformChange} name="platform" id="cp-platform">
              <option disabled value=""></option>
              <option value="CodeForces">CodeForces</option>
              <option value="CodeChef">CodeChef</option>
            </select>

            <label htmlFor="cp-contest">Contest</label>
            <SearchSelect name='contest' id='cp-contest' search={searchContestFunction}
                          keys={['sk', 'name']} callback={this.updateContestSortKey}
                          staticKey={searchContestKey} />

            <button type="button" className="Askd-form-link Askd-form-link-separator">
              Want to skip filtering by contest?
            </button>

            <label htmlFor="cp-title">Problem name</label>
            <SearchSelect name='title' id='cp-title' search={searchProblemFunction}
                          keys={['sk', 'name']} callback={this.updateProblemSortKey}
                          staticKey={searchProblemKey} />

            <input className="Askd-button Module-popup-last" type="submit"
                   value="Add Problem" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddProblemForm;
