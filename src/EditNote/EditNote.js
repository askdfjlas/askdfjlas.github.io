import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadState from '../Enum/LoadState';
import LoadingSpinner from '../Misc/LoadingSpinner';
import EditNoteForm from './EditNoteForm';
import ProblemInfo from './ProblemInfo';
import NotesApi from '../Api/NotesApi';
import UserAuthApi from '../Api/UserAuthApi';
import '../css/EditNote.css';

async function getNoteAndProblemData(props, params) {
  const username = await UserAuthApi.getUsername();
  const platform = props.match.params.platform;
  const contestId = props.match.params.contestId;
  const problemCode = props.match.params.problemCode;
  const problemId = `${contestId}#${problemCode}`;

  const noteInfo = await NotesApi.getNoteInfo(username, platform, problemId);
  return {
    noteInfo: noteInfo
  };
}

function EditNote({ otherProps, info, screen }) {
  const platform = otherProps.match.params.platform;

  if(screen === LoadState.NOT_FOUND) {
    return (
      <div className="Module-description">
        <h2>Note not found!</h2>
      </div>
    );
  }
  else if(screen === LoadState.LOADING) {
    return (
      <LoadingSpinner />
    );
  }
  else {
    return (
      <>
        <ProblemInfo info={info.noteInfo.problemInfo} platform={platform} />
        <EditNoteForm noteInfo={info.noteInfo} platform={platform}
                      history={otherProps.history} />
      </>
    );
  }
}

export default CreateLoadingComponent(
  getNoteAndProblemData, null, 'NoteNotFound', EditNote
);
