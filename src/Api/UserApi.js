import { Auth } from 'aws-amplify';

class UserApi {
  static profile = null;

  static async loadProfile() {
    try {
      UserApi.profile = await Auth.currentAuthenticatedUser();
    }
    catch(err) {
      // currentAuthenticatedUser() throws this error if the user is not logged in
    }
  }

  static async register(username, email, password) {
    const info = await Auth.signUp({
      username,
      password,
      attributes: {
        email: email
      }
    });

    // I like how Amplify makes this one inconsistently lowercase... lol
    return info.codeDeliveryDetails.Destination;
  }

  static async verifyEmail(username, code) {
    await Auth.confirmSignUp(username, code);
  }

  static async resendVerificationEmail(username) {
    const info = await Auth.resendSignUp(username);
    return info.CodeDeliveryDetails.Destination;
  }

  static async forgotPassword(username) {
    const info = await Auth.forgotPassword(username);
    return info.CodeDeliveryDetails.Destination;
  }

  static async resetPassword(username, code, password) {
    await Auth.forgotPasswordSubmit(username, code, password);
  }

  static async login(username, password) {
    await Auth.signIn(username, password);
  }

  static async logout() {
    await Auth.signOut();
    UserApi.profile = null;
  }

  static async getUsername() {
    if(!UserApi.profile)
      await UserApi.loadProfile();

    if(!UserApi.profile)
      return null;

    return UserApi.profile.username;
  }
}

export default UserApi;
