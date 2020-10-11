import queryString from 'query-string';
import Api from './Api';

class UserApi {
  static async getUserInfo(username) {
    const options = {
      'username': username
    };

    const path = `profile?${queryString.stringify(options)}`;
    return await Api.getJson(path);
  }
}

export default UserApi;
