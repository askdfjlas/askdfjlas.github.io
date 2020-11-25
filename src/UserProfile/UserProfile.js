import React, { Component } from 'react';
import UserInfo from './UserInfo';
import UserNotes from './UserNotes';
import UserApi from '../Api/UserApi';
import NotesApi from '../Api/NotesApi';
import UserProfileState from './UserProfileState';
import Utils from '../Utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: UserProfileState.LOADING,
      userInfo: null,
      notes: null
    };
  }

  async getUserInfo() {
    const username = this.props.match.params.username;
    return await UserApi.getUserInfo(username);
  }

  async getNotes() {
    const username = this.props.match.params.username;
    return await NotesApi.getNotes(username);
  }

  async loadInfo() {
    try {
      const userInfo = await this.getUserInfo();
      const notes = await this.getNotes();
      await Utils.setStatePromise(this, {
        screen: UserProfileState.DONE,
        userInfo: userInfo,
        notes: notes
      });
    }
    catch(err) {
      if(err.name === 'UserNotFound') {
        await Utils.setStatePromise(this, {
          screen: UserProfileState.NOT_FOUND
        });
      }
    }
  }

  async componentDidMount() {
    await this.loadInfo();
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.match.params.username !== this.props.match.params.username) {
      await Utils.setStatePromise(this, {
        screen: UserProfileState.LOADING,
        info: null
      });
      await this.loadInfo();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const loadingContent = null;
    const loadedContent = (
      <>
        <div className="Module-description">
          <UserInfo info={this.state.userInfo} />
        </div>
        <UserNotes userInfo={this.state.userInfo} notes={this.state.notes}
                   history={this.props.history} />
      </>
    );
    const userNotFoundContent = (
      <div className="Module-description">
        <h2>User not found!</h2>
      </div>
    );

    var content;
    switch(this.state.screen) {
      case UserProfileState.LOADING:
        content = loadingContent;
        break;
      case UserProfileState.DONE:
        content = loadedContent;
        break;
      case UserProfileState.NOT_FOUND:
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
