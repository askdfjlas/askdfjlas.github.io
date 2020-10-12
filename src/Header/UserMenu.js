import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserAuthApi from '../Api/UserAuthApi';
import '../css/UserMenu.css'

class UserMenu extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  async logout() {
    await UserAuthApi.logout();
    await this.props.logoutCallback();
  }

  render() {
    return (
      <div className="User-menu">
        <ol>
          <li>
            <Link onClick={this.props.closeCallback}
                  to={`/users/${this.props.username}`}>
                  Your profile
            </Link>
          </li>
          <div className="User-menu-divider"></div>
          <li className="User-menu-not-link">Settings</li>
          <li className="User-menu-not-link" onClick={this.logout}>Logout</li>
        </ol>
      </div>
    );
  }
}

export default UserMenu;
