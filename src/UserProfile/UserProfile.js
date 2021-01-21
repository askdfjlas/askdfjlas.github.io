import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import UserInfo from './UserInfo';
import UserNotes from './UserNotes';
import UsersApi from '../Api/UsersApi';
import NotesApi from '../Api/NotesApi';
import LoadState from '../Enum/LoadState';

async function getUserData(props, params) {
  const username = props.match.params.username;
  const userInfo = await UsersApi.getUserInfo(username);
  const notes = await NotesApi.getNotes(username);

  userInfo.totalNotes = notes.length;
  return {
    userInfo: userInfo,
    notes: notes
  };
}

function UserProfile({ otherProps, info, screen }) {
  if(screen === LoadState.NOT_FOUND) {
    return (
      <div className="Module-description">
        <h2>User not found!</h2>
      </div>
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
