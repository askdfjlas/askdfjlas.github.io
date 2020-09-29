import React, { Component } from 'react';
import Utils from './Utils';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import './css/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      showRegisterForm: false,
      showLoginForm: false
    };

    this.toggleRegisterForm = this.toggleRegisterForm.bind(this);
    this.toggleLoginForm = this.toggleLoginForm.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
  }

  async refreshUsername() {
    const username = await UserProfile.getUsername();
    Utils.setStatePromise(this, {
      username: username
    });
  }

  async componentDidMount() {
    await this.refreshUsername();
  }

  async toggleRegisterForm() {
    await Utils.setStatePromise(this, {
      showRegisterForm: !this.state.showRegisterForm
    });
  }

  async toggleLoginForm() {
    await Utils.setStatePromise(this, {
      showLoginForm: !this.state.showLoginForm
    });
  }

  async afterLogin(loggedIn) {
    await this.toggleLoginForm();

    if(loggedIn)
      await this.refreshUsername();
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
      <div className="Header-top-right">
        <span>{ this.state.username }</span>
      </div>
    );

    const topRightButtons = this.state.username ? loggedInButton : loginButtons;

    return (
      <div className="Header">
        {
          this.state.showRegisterForm &&
          <RegisterForm callback={this.toggleRegisterForm} />
        }
        {
          this.state.showLoginForm &&
          <LoginForm callback={this.afterLogin} />
        }
        <h1>cp-notes beta</h1>
        <ul>
          <li>Home</li>
        </ul>
        { topRightButtons }
        <span className="Header-bottom"></span>
      </div>
    );
  }
}

export default Header;
