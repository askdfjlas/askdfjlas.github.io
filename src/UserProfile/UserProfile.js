import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import UserInfo from './UserInfo';
import UserNotes from './UserNotes';
import UsersApi from '../Api/UsersApi';
import NotesApi from '../Api/NotesApi';
import LoadState from '../Enum/LoadState';

async function getUserData(props, params) {
  const username = props.match.params.username;
  const userInfo = await UsersApi.getUserInfo(username);
  const noteInfo = await NotesApi.getNotes(username);

  userInfo.totalNotes = noteInfo.notes.length;
  userInfo.username = username;

  return {
    userInfo: userInfo,
    notes: noteInfo.notes
  };
}

function UserProfile({ otherProps, info, screen }) {
  if(screen === LoadState.NOT_FOUND) {
    return (
      <h2 className="Not-found-text">
        User not found!
      </h2>
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
        <UserInfo info={info.userInfo} />
        <UserNotes userInfo={info.userInfo} notes={info.notes}
                   history={otherProps.history} />
      </>
    );
  }
}

export default CreateLoadingComponent(
  getUserData, null, 'UserNotFound', UserProfile
);
