import Api from './Api';

const CACHE_CAPACITY = 100;
const CACHE_EXPIRATION = 60 * 60 * 1000;
let userInfoCache = {};
let userInfoCacheSize = 0;

class UsersApi {
  static async getUserInfo(username, basicInfoOnly) {
    if(basicInfoOnly && username in userInfoCache) {
      const cachedData = userInfoCache[username];
      if(Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
        delete userInfoCache[username];
        userInfoCacheSize--;
      }
      else {
        return cachedData;
      }
    }

    const options = {
      username: username,
      basicInfoOnly: basicInfoOnly
    };

    const userInfo = await Api.getJson('users', options);

    if(!(username in userInfoCache)) {
      userInfoCacheSize++;
    }

    userInfoCache[username] = {
      username: username,
      avatarData: userInfo.avatarData,
      timestamp: Date.now()
    };

    if(userInfoCacheSize > CACHE_CAPACITY) {
      for(const key in userInfoCache) {
        delete userInfoCache[key];
        break;
      }
      userInfoCacheSize--;
    }

    return userInfo;
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
