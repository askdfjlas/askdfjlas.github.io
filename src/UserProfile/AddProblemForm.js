import React, { Component } from 'react';
import Utils from '../Utils';
import SearchProblemSelect from '../SearchSelect/SearchProblemSelect';
import '../css/AddProblemForm.css';

class AddProblemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      loading: false
    };

    this.platform = null;
    this.contestId = null;
    this.problemId = null;

    this.close = this.close.bind(this);
    this.problemChangeCallback = this.problemChangeCallback.bind(this);
    this.addProblem = this.addProblem.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  close() {
    this.props.callback(null, null, null);
  }

  problemChangeCallback(platform, contestId, problemId) {
    [ this.platform, this.contestId, this.problemId ] = [
      platform, contestId, problemId
    ];
  }

  async addProblem(event) {
    event.preventDefault();

    if(!this.problemId) {
      await Utils.componentSetError(this, 'Please search and select a problem.');
      return;
    }

    await this.setLoading(true);
    this.props.callback(this.problemId, this.platform, this);
  }

  async setLoading(isLoading) {
    await Utils.setStatePromise(this, {
      loading: isLoading
    });
  }

  render() {
    let submitButtonClassName = 'Askd-button';
    if(this.state.loading) {
      submitButtonClassName += ' Askd-form-loading';
    }

    const errorText = this.state.error && (
      <p className="Module-popup-error">{this.state.error}</p>
    );

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular" />
        <div className="Add-problem-form Module-popup">
          { errorText }
          <h2>Add a problem!</h2>
          <form className="Askd-form" onSubmit={this.addProblem}>
            <SearchProblemSelect changeCallback={this.problemChangeCallback} />
            <input className={submitButtonClassName} type="submit"
                   value="Add Problem" disabled={this.state.loading} />
          </form>
        </div>
      </div>
    );
  }
}

export default AddProblemForm;
