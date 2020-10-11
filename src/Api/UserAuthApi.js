import { Auth } from 'aws-amplify';

class UserAuthApi {
  static profile = null;

  static async loadProfile() {
    try {
      UserAuthApi.profile = await Auth.currentAuthenticatedUser();
    }
    catch(err) {
      // currentAuthenticatedUser() throws this error if the user is not logged in
    }
  }

  static async getProfile() {
    if(!UserAuthApi.profile)
      await UserAuthApi.loadProfile();

    return UserAuthApi.profile;
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
    UserAuthApi.profile = null;
  }

  static async getUsername() {
    const profile = await UserAuthApi.getProfile();
    if(!profile)
      return null;

    return profile.username;
  }

  static async getAccessToken() {
    const profile = await UserAuthApi.getProfile();
    if(!profile)
      return null;

    const currentSession = profile.getSignInUserSession();
    const accessToken = currentSession.getAccessToken();
    return accessToken.getJwtToken();
  }
}

export default UserAuthApi;
