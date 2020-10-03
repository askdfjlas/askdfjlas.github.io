import React, { Component } from 'react';
import Utils from '../Utils';
import UserProfile from '../UserProfile';
import HeaderState from './HeaderState';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      username: null,
      destination: null,
      screen: props.screen || HeaderState.LOGIN
    }

    this.close = this.close.bind(this);
    this.login = this.login.bind(this);
    this.enablePasswordRecovery = this.enablePasswordRecovery.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
  }

  close() {
    this.props.exitCallback(false);
  }

  async setError(message) {
    await Utils.setStatePromise(this, {
      error: `Error: ${message}`
    });
  }

  async setSuccess(message) {
    await Utils.setStatePromise(this, {
      error: '',
      success: message
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
      try {
        await UserProfile.login(username, password);
        this.props.exitCallback(true);
      }
      catch(err) {
        if(err.code === 'UserNotConfirmedException') {
          const destination = await UserProfile.resendVerificationEmail(username);
          await this.props.emailVerificationCallback(username, destination);
        }
        else {
          throw err;
        }
      }
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  async enablePasswordRecovery(event) {
    await Utils.setStatePromise(this, {
      error: '',
      screen: HeaderState.RECOVERY_USERNAME
    });
  }

  async forgotPassword(event) {
    event.preventDefault();

    const username = event.target.username.value;
    if(!username) {
      this.setError('Please input your username.');
      return;
    }

    try {
      const destination = await UserProfile.forgotPassword(username);
      Utils.setStatePromise(this, {
        error: '',
        username: username,
        destination: destination,
        screen: HeaderState.RECOVERY_PASSWORD
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  async resetPassword(event) {
    event.preventDefault();

    const form = event.target;
    const code = form.code.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if(!code || !password || !confirmPassword) {
      this.setError('Please fill out all of the fields.');
      return;
    }

    const passwordsOk = await Utils.checkPasswords(this, password, confirmPassword);
    if(!passwordsOk)
      return;

    try {
      await UserProfile.resetPassword(this.state.username, code, password);
      await Utils.setStatePromise(this, {
        error: '',
        success: '',
        screen: HeaderState.RECOVERY_SUCCESS
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  async resendVerificationEmail(event) {
    try {
      await UserProfile.forgotPassword(this.state.username);
      await this.setSuccess('Another email has been sent!');
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  render() {
    const loginForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        <h2>Login to your account!</h2>
        <form className="Askd-form" onSubmit={this.login}>
          <label htmlFor="login-username">Username</label>
          <input autoComplete="off" type="text" name="username"
                 key="login-username" id="login-username" />

          <label htmlFor="login-password">Password</label>
          <input autoComplete="off" type="password" name="password"
                 key="login-password" id="login-password" />

          <div onClick={this.enablePasswordRecovery} className="Askd-form-link">
            Forgot your password?
          </div>

          <input className="Askd-button Module-popup-last" type="submit"
                 value="Login" />
        </form>
      </div>
    );

    const recoveryUsernameForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        <h2>Reset your password</h2>
        <p>
          Please provide your username, so that you can reset your password via
          an emailed confirmation code.
        </p>
        <form className="Askd-form" onSubmit={this.forgotPassword}>
          <label htmlFor="reset-username">Username</label>
          <input autoComplete="off" type="text" name="username"
                 key="reset-username" id="reset-username" />

          <input className="Askd-button Module-popup-last" type="submit"
                 value="Submit" />
        </form>
      </div>
    );

    const recoveryPasswordForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        { this.state.success && <h2>{this.state.success}</h2> }
        <h2>Reset your password</h2>
        <p>
          You should've received an email at { this.state.destination } with a
          verification code.
        </p>
        <form className="Askd-form" onSubmit={this.resetPassword}>
          <label htmlFor="reset-code">Code</label>
          <input autoComplete="off" type="text" name="code"
                 key="reset-code" id="reset-code" />

          <label htmlFor="reset-password">Password</label>
          <input autoComplete="off" type="password" name="password"
                 key="reset-password" id="reset-password" />

          <label htmlFor="reset-confirm-password">Confirm password</label>
          <input autoComplete="off" type="password" name="confirmPassword"
                 key="reset-confirm-password" id="reset-confirm-password" />

          <div onClick={this.resendVerificationEmail} className="Askd-form-link">
            Didn't get the email? Click here to resend
          </div>

          <input className="Askd-button Module-popup-last" type="submit"
                 value="Submit" />
        </form>
      </div>
    );

    const recoveryPasswordSuccess= (
      <div className="Register-form Module-popup">
        <h2>Password reset success!</h2>
        <p className="Module-popup-last">
          Your password has been reset successfully. You'll now be able to
          login again.
        </p>
      </div>
    );

    var currentForm;
    switch(this.state.screen) {
      case HeaderState.LOGIN:
        currentForm = loginForm;
        break;
      case HeaderState.RECOVERY_USERNAME:
        currentForm = recoveryUsernameForm;
        break;
      case HeaderState.RECOVERY_PASSWORD:
        currentForm = recoveryPasswordForm;
        break;
      case HeaderState.RECOVERY_SUCCESS:
        currentForm = recoveryPasswordSuccess;
        break;
      default:
    }

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular">X</button>
        { currentForm }
      </div>
    );
  }
}

export default LoginForm;
