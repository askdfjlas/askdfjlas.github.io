import React, { Component } from 'react';
import UserInfo from './UserInfo';
import UserNotes from './UserNotes';
import UserApi from '../Api/UserApi';
import NotesApi from '../Api/NotesApi';
import UserInfoState from './UserInfoState';
import Utils from '../Utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: UserInfoState.LOADING,
      userInfo: null,
      notes: null
    };
  }

  async loadUserInfo() {
    const username = this.props.match.params.username;
    const userInfo = await UserApi.getUserInfo(username);
    await Utils.setStatePromise(this, {
      userInfo: userInfo
    });
  }

  async loadNotes() {
    const username = this.props.match.params.username;
    const notes = await NotesApi.getNotes(username);
    await Utils.setStatePromise(this, {
      notes: notes
    });
  }

  async loadInfo() {
    try {
      await this.loadUserInfo();
      await this.loadNotes();
      await Utils.setStatePromise(this, {
        screen: UserInfoState.DONE
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
    await this.loadInfo();
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.match.params.username !== this.props.match.params.username) {
      await Utils.setStatePromise(this, {
        screen: UserInfoState.LOADING,
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
