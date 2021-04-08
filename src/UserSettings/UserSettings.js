import React from 'react';
import LinkCfAccountForm from './LinkCfAccountForm';
import UserAuthApi from '../Api/UserAuthApi';
import UsersApi from '../Api/UsersApi';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import LoadState from '../Enum/LoadState';
import '../css/UserSettings.css';

async function getUserInfo() {
  const loggedInUsername = await UserAuthApi.getUsername();
  let userInfo = null;

  if(loggedInUsername) {
    userInfo = await UsersApi.getUserInfo(loggedInUsername);
  }

  return {
    userInfo: userInfo
  };
}

function UserSettings({ otherProps, info, screen }) {
  let innerContent;
  if(screen === LoadState.LOADING) {
    innerContent = (
      <LoadingSpinner />
    );
  }
  else if(info.userInfo) {
    innerContent = (
      <LinkCfAccountForm userInfo={info.userInfo} />
    );
  }
  else {
    innerContent = (
      <p className="Module-paragraph">
        You must log in first to view your settings!
      </p>
    );
  }

  return (
    <div className="User-settings">
      <h2 className="Module-heading">
        Settings
      </h2>
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(getUserInfo, null, null, UserSettings);
