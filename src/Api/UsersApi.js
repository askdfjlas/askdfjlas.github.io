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

  static async getSearchUsers(searchTerm) {
    const options = {
      searchTerm: searchTerm
    };

    return await Api.getJson('users', options);
  }

  static async updateUserInfo(username, avatarData) {
    const options = {
      username: username,
      avatarData: avatarData
    };

    return await Api.putJson('users', options);
  }
}

export default UsersApi;
