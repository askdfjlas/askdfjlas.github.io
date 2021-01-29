import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import LoadState from '../Enum/LoadState';
import ProblemInfo from '../EditNote/ProblemInfo';
import PublicNoteInfo from './PublicNoteInfo';
import ProblemsApi from '../Api/ProblemsApi';
import NotesApi from '../Api/NotesApi';

async function getNoteAndProblemData(props, params) {
  const ownerUsername = props.match.params.ownerUsername;
  const platform = props.match.params.platform;
  const contestId = props.match.params.contestId;
  const problemCode = props.match.params.problemCode;
  const problemId = `${contestId}#${problemCode}`;

  let problemInfo = await ProblemsApi.getProblemInfo(platform, problemId);
  problemInfo.problemId = problemId;

  const noteInfo = await NotesApi.getNoteInfo(ownerUsername, platform, problemId, true);
  return {
    problemInfo: problemInfo,
    noteInfo: noteInfo
  };
}

function PublicNote({ otherProps, info, screen }) {
  const platform = otherProps.match.params.platform;

  let innerContent;
  if(screen === LoadState.NOT_FOUND) {
    innerContent = (
      <div className="Module-description">
        <h2>Note is either unpublished or does not exist!</h2>
      </div>
    );
  }
  else if(screen === LoadState.LOADING) {
    innerContent = (
      <LoadingSpinner />
    );
  }
  else {
    innerContent = (
      <>
        <ProblemInfo info={info.problemInfo} platform={platform} />
        <PublicNoteInfo info={info.noteInfo} />
      </>
    );
  }

  return (
    <div className="Module-wrapper">
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(
  getNoteAndProblemData, null, 'NoteNotFound', PublicNote
);
