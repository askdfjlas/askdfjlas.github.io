import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import LoadState from '../Enum/LoadState';
import ProblemInfo from '../EditNote/ProblemInfo';
import PublicNoteInfo from './PublicNoteInfo';
import PublicNoteComments from './PublicNoteComments';
import NotesApi from '../Api/NotesApi';
import UserAuthApi from '../Api/UserAuthApi';

async function getNoteData(props, params) {
  const ownerUsername = props.match.params.ownerUsername;
  const platform = props.match.params.platform;
  const contestId = props.match.params.contestId;
  const problemCode = props.match.params.problemCode;
  const problemId = `${contestId}#${problemCode}`;

  const noteInfo = await NotesApi.getNoteInfo(ownerUsername, platform, problemId, true);
  const loggedInUsername = await UserAuthApi.getUsername();

  return {
    noteInfo: noteInfo,
    loggedInUsername: loggedInUsername
  };
}

function PublicNote({ otherProps, info, screen }) {
  const platform = otherProps.match.params.platform;
  const doNotShowComments = !(screen === LoadState.DONE);
  const commentsComponent = (
    <PublicNoteComments match={otherProps.match} doNotShow={doNotShowComments}
                        history={otherProps.history} key="comments" />
  );

  if(screen === LoadState.NOT_FOUND) {
    return (
      <div className="Module-description">
        <h2>Note is either unpublished or does not exist!</h2>
      </div>
    );
  }
  else if(screen === LoadState.LOADING) {
    return (
      <>
        <LoadingSpinner />
        { commentsComponent }
      </>
    );
  }
  else {
    return (
      <>
        <ProblemInfo info={info.noteInfo.problemInfo} platform={platform} />
        <PublicNoteInfo loggedInUsername={info.loggedInUsername} info={info.noteInfo} />
        { commentsComponent }
      </>
    );
  }
}

export default CreateLoadingComponent(
  getNoteData, null, 'NoteNotFound', PublicNote
);
