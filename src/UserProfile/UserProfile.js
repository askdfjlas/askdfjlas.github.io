import React, { Component } from 'react';
import UserInfo from './UserInfo';
import UserProblems from './UserProblems';
import UserApi from '../Api/UserApi';
import UserInfoState from './UserInfoState';
import Utils from '../Utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: UserInfoState.LOADING,
      info: null
    };
  }

  async loadUserInfo() {
    try {
      const username = this.props.match.params.username;
      const info = await UserApi.getUserInfo(username);
      await Utils.setStatePromise(this, {
        screen: UserInfoState.DONE,
        info: info
      });
    }
    catch(err) {
      if(err.name === 'UserNotFound') {
        await Utils.setStatePromise(this, {
          screen: UserInfoState.NOT_FOUND
        });
      }
    }
  }

  async componentDidMount() {
    await this.loadUserInfo();
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.match.params.username !== this.props.match.params.username) {
      await Utils.setStatePromise(this, {
        screen: UserInfoState.LOADING,
        info: null
      });
      await this.loadUserInfo();
    }
  }

  render() {
    const loadingContent = null;
    const loadedContent = (
      <>
        <div className="Module-description">
          <UserInfo info={this.state.info} />
        </div>
        <UserProblems info={this.state.info} />
      </>
    );
    const userNotFoundContent = (
      <div className="Module-description">
        <h2>User not found!</h2>
      </div>
    );

    var content;
    switch(this.state.screen) {
      case UserInfoState.LOADING:
        content = loadingContent;
        break;
      case UserInfoState.DONE:
        content = loadedContent;
        break;
      case UserInfoState.NOT_FOUND:
        content = userNotFoundContent;
        break;
      default:
    }

    return (
      <>
        <div className="Module-wrapper">
          { content }
        </div>
      </>
    );
  }
}

export default UserProfile;
