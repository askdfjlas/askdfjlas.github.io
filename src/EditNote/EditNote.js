import React, { Component } from 'react';
import LoadState from '../Enum/LoadState';
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
        <EditNoteForm problemInfo={this.state.problemInfo}
                      noteInfo={this.state.noteInfo} platform={platform}
                      history={this.props.history} />
      </>
    );
    const noteNotFoundContent = (
      <div className="Module-description">
        <h2>Note does not exist!</h2>
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

export default EditNote;
