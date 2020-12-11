import React, { Component } from 'react';
import LoadState from '../Enum/LoadState';
import ProblemInfo from '../EditNote/ProblemInfo';
import PublicNoteInfo from './PublicNoteInfo';
import ProblemsApi from '../Api/ProblemsApi';
import NotesApi from '../Api/NotesApi';
import Utils from '../Utils';

class PublicNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: LoadState.LOADING,
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
    const ownerUsername = this.props.match.params.ownerUsername;
    const platform = this.props.match.params.platform;
    const contestId = this.props.match.params.contestId;
    const problemCode = this.props.match.params.problemCode;
    const problemId = `${contestId}#${problemCode}`;

    const noteInfo = await NotesApi.getNoteInfo(ownerUsername, platform, problemId, true);
    return noteInfo;
  }

  async loadInfo() {
    const problemInfo = await this.loadProblemInfo();
    const noteInfo = await this.loadNoteInfo();

    await Utils.setStatePromise(this, {
      problemInfo: problemInfo,
      noteInfo: noteInfo,
      screen: LoadState.DONE
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

    const loadingContent = null;
    const loadedContent = (
      <>
        <ProblemInfo info={this.state.problemInfo} platform={platform} />
        <PublicNoteInfo info={this.state.noteInfo} />
      </>
    );
    const noteNotFoundContent = (
      <div className="Module-description">
        <h2>Note is either unpublished or does not exist!</h2>
      </div>
    );

    let content;
    switch(this.state.screen) {
      case LoadState.LOADING:
        content = loadingContent;
        break;
      case LoadState.DONE:
        content = loadedContent;
        break;
      case LoadState.NOT_FOUND:
        content = noteNotFoundContent;
        break;
      default:
    }

    return (
      <div className="Module-wrapper">
        { content }
      </div>
    );
  }
}

export default PublicNote;
