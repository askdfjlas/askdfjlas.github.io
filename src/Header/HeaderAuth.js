import React, { Component } from 'react';
import Utils from '../Utils';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import UserMenu from './UserMenu';
import UserAuthApi from '../Api/UserAuthApi';

class HeaderAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      showRegisterForm: false,
      showLoginForm: false,
      showUserMenu: false,
      unverifiedAccountUsername: null,
      unverifiedAccountDestination: null
    };

    this.refreshUsername = this.refreshUsername.bind(this);
    this.toggleRegisterForm = this.toggleRegisterForm.bind(this);
    this.toggleLoginForm = this.toggleLoginForm.bind(this);
    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
    this.unverifiedAccount = this.unverifiedAccount.bind(this);
  }

  async refreshUsername() {
    const username = await UserAuthApi.getUsername();

    await Utils.setStatePromise(this, {
      username: username,
      showUserMenu: false,
      unverifiedAccountUsername: null
    });
  }

  async componentDidMount() {
    await this.refreshUsername();
  }

  async toggleRegisterForm(event) {
    if(this.state.showRegisterForm) {
      await Utils.setStatePromise(this, {
        unverifiedAccountUsername: null,
        unverifiedAccountDestination: null
      });
    }

    await Utils.setStatePromise(this, {
      showRegisterForm: !this.state.showRegisterForm
    });
  }

  async toggleLoginForm(event) {
    await Utils.setStatePromise(this, {
      showLoginForm: !this.state.showLoginForm
    });
  }

  async toggleUserMenu(event) {
    const focusedElement = event.relatedTarget;
    if(focusedElement && focusedElement.nodeName === 'A')
      return;

    await Utils.setStatePromise(this, {
      showUserMenu: !this.state.showUserMenu
    });
  }

  async afterLogin(loggedIn) {
    await this.toggleLoginForm();

    if(loggedIn)
      await this.refreshUsername();
  }

  async unverifiedAccount(username, destination) {
    await Utils.setStatePromise(this, {
      showLoginForm: false,
      showRegisterForm: true,
      unverifiedAccountUsername: username,
      unverifiedAccountDestination: destination
    });
  }

  render() {
    const loginButtons = (
      <div className="Header-top-right">
        <span onClick={this.toggleLoginForm}>Login</span>
        <span className="Header-divider"></span>
        <span onClick={this.toggleRegisterForm}>Create an account</span>
      </div>
    );

    const loggedInButton = (
      <div className="Header-logged-in" tabIndex="-1"
           onBlur={this.toggleUserMenu}>
        <div className="Header-top-right">
          <span onClick={this.toggleUserMenu}>{ this.state.username }</span>
        </div>
        <div className="Header-user-menu">
          {
            this.state.showUserMenu &&
            <UserMenu username={this.state.username}
                      logoutCallback={this.refreshUsername} />
          }
        </div>
      </div>
    );

    const topRightButtons = this.state.username ? loggedInButton : loginButtons;

    return (
      <>
        {
          this.state.showRegisterForm &&
          <RegisterForm exitCallback={this.toggleRegisterForm}
                        unverifiedAccountUsername=
                        {this.state.unverifiedAccountUsername}
                        unverifiedAccountDestination=
                        {this.state.unverifiedAccountDestination} />
        }
        {
          this.state.showLoginForm &&
          <LoginForm exitCallback={this.afterLogin}
                     emailVerificationCallback={this.unverifiedAccount} />
        }
        { topRightButtons }
      </>
    );
  }
}

export default HeaderAuth;
