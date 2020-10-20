import queryString from 'query-string';
import ApiConstants from './ApiConstants';
import UserAuthApi from './UserAuthApi';

class Api {
  static createApiError(name, message) {
    const err = Error(message);
    err.name = name;

    return err;
  }

  static async manageResponseError(response) {
    if(response.status === 400) {
      const responseJson = await response.json();
      throw Api.createApiError(responseJson.name, responseJson.message);
    }
    else if(response.status !== 200) {
      throw Error('Request failed!');
    }
  }

  static async getJson(resource, options) {
    const path = `${resource}?${queryString.stringify(options)}`;
    const accessToken = await UserAuthApi.getAccessToken();

    const response = await fetch(ApiConstants.API_ENDPOINT + path, {
      headers: {
        Authorization: accessToken
      }
    });

    await Api.manageResponseError(response);
    return await response.json();
  }

  static async postJson(resource, options) {
    const accessToken = await UserAuthApi.getAccessToken();

    const response = await fetch(ApiConstants.API_ENDPOINT + resource, {
      method: 'POST',
      body: JSON.stringify(options),
      headers: {
        Authorization: accessToken
      }
    });

    await Api.manageResponseError(response);
    return await response.json();
  }
}

export default Api;
