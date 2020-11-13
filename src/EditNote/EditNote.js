import React, { Component } from 'react';
import EditNoteState from './EditNoteState';
import EditNoteForm from './EditNoteForm';
import ProblemInfo from './ProblemInfo';
import ProblemsApi from '../Api/ProblemsApi'
import NotesApi from '../Api/NotesApi';
import UserAuthApi from '../Api/UserAuthApi';
import Utils from '../Utils';
import '../css/EditNote.css';

class EditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: EditNoteState.LOADING,
      problemInfo: null,
      noteInfo: null
    };
  }

  async loadProblemInfo() {
    const platform = this.props.match.params.platform;
    const contestId = this.props.match.params.contestId;
    const problemCode = this.props.match.params.problemCode;
    const problemId = `${contestId}#${problemCode}`;

    let problemInfo = await ProblemsApi.getProblemInfo(platform, problemId);
    problemInfo.problemId = problemId;

    return problemInfo;
  }

  async loadNoteInfo() {
    const username = await UserAuthApi.getUsername();
    const platform = this.props.match.params.platform;
    const contestId = this.props.match.params.contestId;
    const problemCode = this.props.match.params.problemCode;
    const problemId = `${contestId}#${problemCode}`;

    const noteInfo = await NotesApi.getNoteInfo(username, platform, problemId);

    return noteInfo;
  }

  async loadInfo() {
    const problemInfo = await this.loadProblemInfo();
    const noteInfo = await this.loadNoteInfo();
    await Utils.setStatePromise(this, {
      problemInfo: problemInfo,
      noteInfo: noteInfo,
      screen: EditNoteState.DONE
    });
  }

  async componentDidMount() {
    await this.loadInfo();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const platform = this.props.match.params.platform;

    return (
      <div className="Module-wrapper">
        {
          this.state.screen === EditNoteState.DONE &&
          <>
            <ProblemInfo info={this.state.problemInfo} platform={platform} />
            <EditNoteForm problemInfo={this.state.problemInfo}
                          noteInfo={this.state.noteInfo} platform={platform}
                          history={this.props.history} />
          </>
        }
      </div>
    );
  }
}

export default EditNote;
