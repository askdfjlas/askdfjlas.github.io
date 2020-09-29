import { Auth } from 'aws-amplify';

class UserProfile {
  static profile = null;

  static async register(username, email, password) {
    await Auth.signUp({
      username,
      password,
      attributes: {
        email: email
      }
    });
  }

  static async verifyEmail(username, code) {
    await Auth.confirmSignUp(username, code);
  }

  static async loadProfile() {
    try {
      UserProfile.profile = await Auth.currentAuthenticatedUser();
    }
    catch(err) {
      // currentAuthenticatedUser() throws this error if the user is not logged in
    }
  }

  static async login(username, password) {
    await Auth.signIn(username, password);
  }

  static async getUsername() {
    if(!UserProfile.profile)
      await UserProfile.loadProfile();

    if(!UserProfile.profile)
      return null;

    return UserProfile.profile.username;
  }
}

export default UserProfile;
