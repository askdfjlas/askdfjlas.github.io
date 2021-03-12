import React, { Component } from 'react';
import Utils from '../Utils';
import HeaderUtils from './HeaderUtils';
import UserAuthApi from '../Api/UserAuthApi';
import HeaderState from './HeaderState';
import '../css/RegisterForm.css';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const ERROR_TRIGGER_PREFIX = 'PreSignUp failed with error';

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    const screen = props.unverifiedAccountUsername ?
                   HeaderState.REGISTER_VERIFY : HeaderState.REGISTER;
    this.state = {
      error: '',
      success: '',
      username: props.unverifiedAccountUsername,
      destination: props.unverifiedAccountDestination,
      screen: screen,
      loading: false
    };

    this.close = this.close.bind(this);
    this.register = this.register.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  close() {
    this.props.exitCallback();
  }

  async setError(message) {
    if(message.startsWith(ERROR_TRIGGER_PREFIX)) {
      message = message.substring(
        ERROR_TRIGGER_PREFIX.length, message.length - 1
      );
    }

    await Utils.setStatePromise(this, {
      error: `Error: ${message}`,
      success: ''
    });
  }

  async register(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if(!username || !email || !password || !confirmPassword) {
      await this.setError('Please fill out all of the fields.')
      return;
    }

    if(username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
      await this.setError(
        `Your username must be between ${USERNAME_MIN_LENGTH} ` +
        `and ${USERNAME_MAX_LENGTH} characters!`
      );
      return;
    }

    const passwordsOk = await HeaderUtils.checkPasswords(this, password, confirmPassword);
    if(!passwordsOk)
      return;

    await this.setLoading(true);
    try {
      const destination = await UserAuthApi.register(username, email, password);
      Utils.setStatePromise(this, {
        error: '',
        username: username,
        destination: destination,
        screen: HeaderState.REGISTER_VERIFY
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
    await this.setLoading(false);
  }

  async verifyEmail(event) {
    event.preventDefault();

    const code = event.target.code.value;
    await this.setLoading(true);
    try {
      await UserAuthApi.verifyEmail(this.state.username, code);
      Utils.setStatePromise(this, {
        error: '',
        success: '',
        screen: HeaderState.REGISTER_SUCCESS
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
    await this.setLoading(false);
  }

  async resendVerificationEmail(event) {
    try {
      await UserAuthApi.resendVerificationEmail(this.state.username);
      await Utils.componentSetSuccess(this, 'Another email has been sent!');
    }
    catch(err) {
      await this.setError(err.message);
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

    const createAccountForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        <h2>Create an account!</h2>
        <form className="Askd-form" onSubmit={this.register}>
          <label htmlFor="register-username">Username</label>
          <input autoComplete="off" type="text" name="username"
                 id="register-username" />

          <label htmlFor="register-email">Email</label>
          <input autoComplete="off" type="text" name="email"
                 id="register-email" />

          <label htmlFor="register-password">Password</label>
          <input autoComplete="off" type="password" name="password"
                 id="register-password" />

          <label htmlFor="register-confirm-password">Confirm password</label>
          <input autoComplete="off" type="password" name="confirmPassword"
                 id="register-confirm-password" />

          <input className={submitButtonClassName} type="submit" value="Register"
                 disabled={this.state.loading} />
        </form>
      </div>
    );

    const verifyEmailForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        { this.state.success && <h2>{this.state.success}</h2> }
        <h2>Verify your email!</h2>
        <p>
          You should've received an email at {this.state.destination} with a
          verification code. If it isn't convenient for you to verify your
          account now, you may do so later by logging in.
        </p>
        <form className="Askd-form" onSubmit={this.verifyEmail}>
          <label htmlFor="verification-code">Verification code</label>
          <input autoComplete="off" type="text" name="code"
                 key="verification-code" id="verification-code" />

          <button type="button" onClick={this.resendVerificationEmail}
                  className="Askd-form-link Askd-form-link-bottom">
            Didn't get the email? Click here to resend
          </button>

          <input className={submitButtonClassName} type="submit" value="Submit"
                 disabled={this.state.loading} />
        </form>
      </div>
    );

    const emailVerifiedBox = (
      <div className="Register-form Module-popup">
        <h2>Verification success!</h2>
        <p className="Module-popup-last">
          Your email was successfully verified! Click the 'X' button in the
          top-right corner to return to the site, and you'll be able to login.
        </p>
      </div>
    );

    var currentForm;
    switch(this.state.screen) {
      case HeaderState.REGISTER:
        currentForm = createAccountForm;
        break;
      case HeaderState.REGISTER_VERIFY:
        currentForm = verifyEmailForm;
        break;
      case HeaderState.REGISTER_SUCCESS:
        currentForm = emailVerifiedBox;
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

export default RegisterForm;
