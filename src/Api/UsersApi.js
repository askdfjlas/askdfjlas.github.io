import Api from './Api';

class UsersApi {
  static async getUserInfo(username) {
    const options = {
      username: username
    };

    return await Api.getJson('users', options);
  }

  static async getUsers(page) {
    const options = {
      page: page
    };

    return await Api.getJson('users', options);
  }
}

export default UsersApi;
