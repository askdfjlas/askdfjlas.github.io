import React, { Component } from 'react';
import Utils from './Utils';
import UserProfile from './UserProfile';
import './css/RegisterForm.css';

const MIN_PASSWORD_LENGTH = 6;

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      username: null,
      registered: false,
      verified: false
    }

    this.close = this.close.bind(this);
    this.register = this.register.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  close() {
    this.props.callback(this.state.registered);
  }

  async setError(message) {
    await Utils.setStatePromise(this, {
      error: `Error: ${message}`
    });
  }

  async register(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if(!username || !email || !password)
      await this.setError("Please fill out all of the fields.")

    if(password !== confirmPassword)
      await this.setError("Your passwords don't match!");

    if(password.length < MIN_PASSWORD_LENGTH)
      await this.setError("Your password is too short!")

    try {
      await UserProfile.register(username, email, password);
      Utils.setStatePromise(this, {
        error: '',
        username: username,
        registered: true
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  async verifyEmail(event) {
    event.preventDefault();

    const code = event.target.code.value;
    try {
      await UserProfile.verifyEmail(this.state.username, code);
      Utils.setStatePromise(this, {
        error: '',
        verified: true
      });
    }
    catch(err) {
      await this.setError(err.message);
    }
  }

  render() {
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

          <input className="Askd-button Module-popup-last" type="submit"
                 value="Register" />
        </form>
      </div>
    );

    const verifyEmailForm = (
      <div className="Register-form Module-popup">
        { this.state.error && <h2>{this.state.error}</h2> }
        <h2>Verify your email!</h2>
        <p>
          You should've received a verification code via email. If it isn't
          convenient for you to verify your account now, you may do it later
          by logging in.
        </p>
        <form className="Askd-form" onSubmit={this.verifyEmail}>
          <label htmlFor="verification-code">Verification code</label>
          <input autoComplete="off" type="text" name="code"
                 key="verification-code" id="verification-code" />
          <input className="Askd-button Module-popup-last" type="submit"
                 value="Submit" />
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
    if(this.state.verified) {
      currentForm = emailVerifiedBox;
    }
    else {
      currentForm = this.state.registered ? verifyEmailForm : createAccountForm;
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

export default RegisterForm;
