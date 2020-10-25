import React, { Component } from 'react';
import Utils from '../Utils';
import SearchSelect from '../SearchSelect/SearchSelect';
import ProblemsApi from '../Api/ProblemsApi';
import '../css/AddProblemForm.css';

class AddProblemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      platform: null,
      contestSortKey: null,
      problemSortKey: null,
      skipContestSearch: false
    };

    this.close = this.close.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.toggleSkipContestSearch = this.toggleSkipContestSearch.bind(this);
    this.updateProblemSortKey = this.updateProblemSortKey.bind(this);
    this.updateContestSortKey = this.updateContestSortKey.bind(this);
    this.addProblem = this.addProblem.bind(this);
  }

  close() {
    this.props.callback(null, null, null);
  }

  async handlePlatformChange(event) {
    await Utils.setStatePromise(this, {
      platform: event.target.value
    });
  }

  async toggleSkipContestSearch(event) {
    await Utils.setStatePromise(this, {
      skipContestSearch: !this.state.skipContestSearch,
      contestSortKey: null,
      problemSortKey: null
    });
  }

  async updateContestSortKey(sortKey) {
    await Utils.setStatePromise(this, {
      contestSortKey: sortKey,
      problemSortKey: null
    });
  }

  async updateProblemSortKey(sortKey) {
    await Utils.setStatePromise(this, {
      problemSortKey: sortKey
    });
  }

  async addProblem(event) {
    event.preventDefault();

    if(!this.state.problemSortKey) {
      await Utils.componentSetError(this, 'Please search and select a problem.');
      return;
    }

    this.props.callback(this.state.problemSortKey, this.state.platform, this);
  }

  render() {
    var searchContestFunction = null;
    var searchContestKey = null;
    if(this.state.platform && !this.state.skipContestSearch) {
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
    else if(this.state.platform && this.state.skipContestSearch) {
      searchProblemFunction = () => ProblemsApi.getProblems(this.state.platform);
      searchProblemKey = this.state.platform;
    }

    var skipButtonText = this.state.skipContestSearch ?
                         'Want to filter by contest?' :
                         'Want to skip filtering by contest?';

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular">
                X
        </button>
        <div className="Add-problem-form Module-popup">
          { this.state.error && <h2>{this.state.error}</h2> }
          <h2>Add a problem!</h2>
          <form className="Askd-form" onSubmit={this.addProblem}>
            <label htmlFor="cp-platform">Platform</label>
            <select defaultValue="" onChange={this.handlePlatformChange}
                    name="platform" id="cp-platform">
              <option disabled value=""></option>
              <option value="CodeForces">CodeForces</option>
              <option value="CodeChef">CodeChef</option>
            </select>

            <label htmlFor="cp-contest">Contest</label>
            <SearchSelect name='contest' id='cp-contest' search={searchContestFunction}
                          keys={['sk', 'name']} callback={this.updateContestSortKey}
                          displayKey='name' staticKey={searchContestKey} />

            <button onClick={this.toggleSkipContestSearch}
                    type="button" className="Askd-form-link Askd-form-link-separator">
              { skipButtonText }
            </button>

            <label htmlFor="cp-title">Problem</label>
            <SearchSelect name='title' id='cp-title' search={searchProblemFunction}
                          keys={['prettySk', 'name']} callback={this.updateProblemSortKey}
                          displayKey='name' staticKey={searchProblemKey} />

            <input className="Askd-button Module-popup-last" type="submit"
                   value="Add Problem" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddProblemForm;
