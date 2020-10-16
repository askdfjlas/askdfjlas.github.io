import queryString from 'query-string';
import ApiConstants from './ApiConstants';
import UserAuthApi from './UserAuthApi';

class Api {
  static async getJson(resource, options) {
    const path = `${resource}?${queryString.stringify(options)}`;
    const accessToken = await UserAuthApi.getAccessToken();

    const response = await fetch(ApiConstants.API_ENDPOINT + path, {
      headers: {
        Authorization: accessToken
      }
    });

    if(response.status === 400) {
      const responseJson = await response.json();

      const err = Error(responseJson.message);
      err.name = responseJson.name;
      throw err;
    }
    else if(response.status !== 200) {
      throw Error('Request failed!');
    }

    return await response.json();
  }
}

export default Api;
