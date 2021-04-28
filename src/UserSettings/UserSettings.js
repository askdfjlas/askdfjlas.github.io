import React from 'react';
import LinkCfAccountForm from './LinkCfAccountForm';
import UserAuthApi from '../Api/UserAuthApi';
import UsersApi from '../Api/UsersApi';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import LoadState from '../Enum/LoadState';
import Username from '../Misc/Username';
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
    const userInfo = info.userInfo;
    let innerInnerContent;

    if(info.userInfo.cfUsername) {
      innerInnerContent = (
        <p className="Module-paragraph">
          You've linked the following account:
          {' '}
          <Username username={userInfo.cfUsername} rank={userInfo.cfRank}
                    linkToCf={true} />
          {' '}
          <b>({userInfo.cfRating})</b>
        </p>
      );
    }
    else {
      innerInnerContent = (
        <LinkCfAccountForm userInfo={userInfo} history={otherProps.history} />
      );
    }

    innerContent = (
      <div className="Module-outer-space User-settings-cf">
        <h3 className="Module-heading">
          Codeforces account
        </h3>
        { innerInnerContent }
      </div>
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
        <span className="icon-gear" />
        Settings
      </h2>
      { innerContent }
    </div>
  );
}

export default CreateLoadingComponent(getUserInfo, null, null, UserSettings);
