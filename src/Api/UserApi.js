import Api from './Api';

class UserApi {
  static async getUserInfo(username) {
    const options = {
      'username': username
    };

    return await Api.getJson('profile', options);
  }
}

export default UserApi;
