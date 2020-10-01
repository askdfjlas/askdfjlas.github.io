import React, { Component } from 'react';
import UserProfile from '../UserProfile';
import '../css/UserMenu.css'

class UserMenu extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  async logout() {
    await UserProfile.logout();
    await this.props.logoutCallback();
  }

  render() {
    return (
      <div className="User-menu">
        <ol>
          <li>Your profile</li>
          <div className="User-menu-divider"></div>
          <li>Settings</li>
          <li onClick={this.logout}>Logout</li>
        </ol>
      </div>
    );
  }
}

export default UserMenu;
