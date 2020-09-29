import React, { Component } from 'react';
import Utils from './Utils';
import UserProfile from './UserProfile';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    }

    this.close = this.close.bind(this);
    this.login = this.login.bind(this);
  }

  close() {
    this.props.callback(false);
  }

  async setError(message) {
    await Utils.setStatePromise(this, {
      error: `Error: ${message}`
    });
  }

  async login(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    if(!username || !password)
      await this.setError("Please fill out all of the fields.")

    try {
      await UserProfile.login(username, password);
      this.props.callback(true);
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  render() {
    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular">X</button>
        <div className="Register-form Module-popup">
          { this.state.error && <h2>{this.state.error}</h2> }
          <h2>Login to your account!</h2>
          <form className="Askd-form" onSubmit={this.login}>
            <label htmlFor="login-username">Username</label>
            <input autoComplete="off" type="text" name="username"
                   id="login-username" />

            <label htmlFor="login-password">Password</label>
            <input autoComplete="off" type="password" name="password"
                   id="login-password" />

            <input className="Askd-button Module-popup-last" type="submit"
                   value="Login" />
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
