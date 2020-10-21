import React, { Component } from 'react';
import EditNoteState from './EditNoteState';
import ProblemInfo from './ProblemInfo';
import ProblemsApi from '../Api/ProblemsApi'
import Utils from '../Utils';
import '../css/EditNote.css';

class EditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: EditNoteState.LOADING,
      problemInfo: null
    };
  }

  async loadProblemInfo() {
    const platform = this.props.match.params.platform;
    const contestId = this.props.match.params.contestId;
    const problemCode = this.props.match.params.problemCode;
    const problemId = `${contestId}#${problemCode}`;

    const problemInfo = await ProblemsApi.getProblemInfo(platform, problemId);
    await Utils.setStatePromise(this, {
      problemInfo: problemInfo
    });
  }

  async loadInfo() {
    await this.loadProblemInfo();
    await Utils.setStatePromise(this, {
      screen: EditNoteState.DONE
    });
  }

  async componentDidMount() {
    await this.loadProblemInfo();
  }

  render() {
    return (
      <div className="Module-wrapper">
        <ProblemInfo info={this.state.problemInfo}
                     platform={this.props.match.params.platform} />
      </div>
    );
  }
}

export default EditNote;
