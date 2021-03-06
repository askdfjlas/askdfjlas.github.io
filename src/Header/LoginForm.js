import React, { Component } from 'react';
import Utils from '../Utils';
import HeaderUtils from './HeaderUtils';
import UserAuthApi from '../Api/UserAuthApi';
import HeaderState from './HeaderState';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      username: null,
      destination: null,
      loading: false,
      screen: props.screen || HeaderState.LOGIN
    }

    this.close = this.close.bind(this);
    this.login = this.login.bind(this);
    this.enablePasswordRecovery = this.enablePasswordRecovery.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  close() {
    this.props.exitCallback(false);
  }

  async login(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    if(!username || !password) {
      await Utils.componentSetError(this, "Please fill out all of the fields.");
      return;
    }

    await this.setLoading(true);
    try {
      await UserAuthApi.login(username, password);
      this.props.exitCallback(true);

      if(window.loginTasks) {
        for(const task of window.loginTasks) {
          task();
        }
      }
    }
    catch(err) {
      if(err.code === 'UserNotConfirmedException') {
        const destination = await UserAuthApi.resendVerificationEmail(username);
        await this.props.emailVerificationCallback(username, destination);
      }
      else {
        if(err.code === 'InvalidParameterException') {
          err.message = 'User does not exist.';
        }
        await Utils.componentSetError(this, err.message);
      }
    }
    await this.setLoading(false);
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
      await Utils.componentsSetError(this, 'Please input your username.');
      return;
    }

    await this.setLoading(true);
    try {
      const destination = await UserAuthApi.forgotPassword(username);

      await Utils.setStatePromise(this, {
        error: '',
        username: username,
        destination: destination,
        screen: HeaderState.RECOVERY_PASSWORD
      });
    }
    catch(err) {
      if(err.code === 'InvalidParameterException') {
        err.message = 'Your username or email address isn\'t valid!';
      }
      await Utils.componentSetError(this, err.message);
    }
    await this.setLoading(false);
  }

  async resetPassword(event) {
    event.preventDefault();

    const form = event.target;
    const code = form.code.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if(!code || !password || !confirmPassword) {
      Utils.componentSetError(this, 'Please fill out all of the fields.');
      return;
    }

    const passwordsOk = await HeaderUtils.checkPasswords(this, password, confirmPassword);
    if(!passwordsOk)
      return;

    await this.setLoading(true);
    try {
      await UserAuthApi.resetPassword(this.state.username, code, password);

      await Utils.setStatePromise(this, {
        error: '',
        success: '',
        screen: HeaderState.RECOVERY_SUCCESS
      });
    }
    catch(err) {
      if(err.code === 'InvalidParameterException') {
        err.message = 'Invalid verification code provided, please try again.';
      }
      await Utils.componentSetError(this, err.message);
    }
    await this.setLoading(false);
  }

  async resendVerificationEmail(event) {
    try {
      await UserAuthApi.forgotPassword(this.state.username);
      await Utils.componentSetSuccess(
        this, 'Another email has been sent! Remember to check your spam folder.'
      );
      await Utils.setStatePromise(this, {
        error: ''
      });
    }
    catch(err) {
      await Utils.componentSetError(this, err.message);
    }
  }

  async setLoading(isLoading) {
    await Utils.setStatePromise(this, {
      loading: isLoading
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let submitButtonClassName = 'Askd-button';
    if(this.state.loading) {
      submitButtonClassName += ' Askd-form-loading';
    }

    const errorText = this.state.error && (
      <p className="Module-popup-error">{this.state.error}</p>
    );

    const successText = this.state.success && (
      <p className="Module-popup-success">{this.state.success}</p>
    );

    const loginForm = (
      <div className="Register-form Module-popup">
        { errorText }
        <h2>Login to your account!</h2>
        <form className="Askd-form" onSubmit={this.login}>
          <label htmlFor="login-username">Username or email</label>
          <input autoComplete="off" type="text" name="username"
                 key="login-username" id="login-username" />

          <label htmlFor="login-password">Password</label>
          <input autoComplete="off" type="password" name="password"
                 key="login-password" id="login-password" />

          <button type="button" onClick={this.enablePasswordRecovery}
                  className="Askd-form-link Askd-form-link-bottom">
            Forgot your password?
          </button>

          <input className={submitButtonClassName} type="submit" value="Login"
                 disabled={this.state.loading} />
        </form>
      </div>
    );

    const recoveryUsernameForm = (
      <div className="Register-form Module-popup">
        { errorText }
        <h2>Reset your password</h2>
        <p>
          Please provide your username or email, so that you can reset your
          password via an emailed confirmation code.
        </p>
        <form className="Askd-form" onSubmit={this.forgotPassword}>
          <label htmlFor="reset-username">Username or email</label>
          <input autoComplete="off" type="text" name="username"
                 key="reset-username" id="reset-username" />

          <input className={submitButtonClassName} type="submit" value="Submit"
                 disabled={this.state.loading} />
        </form>
      </div>
    );

    const recoveryPasswordForm = (
      <div className="Register-form Module-popup">
        { errorText }
        { successText }
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

          <button type="button" onClick={this.resendVerificationEmail}
                  className="Askd-form-link Askd-form-link-bottom">
            Didn't get the email? Click here to resend
          </button>

          <input className={submitButtonClassName} type="submit" value="Submit"
                 disabled={this.state.loading} />
        </form>
      </div>
    );

    const recoveryPasswordSuccess= (
      <div className="Register-form Module-popup">
        <h2>Password reset success!</h2>
        <p>
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
                className="Askd-form-close Askd-button Askd-button-circular" />
        { currentForm }
      </div>
    );
  }
}

export default LoginForm;
