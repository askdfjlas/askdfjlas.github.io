import queryString from 'query-string';

const API_STORAGE_KEY = 'askdfjlas.github.io';
const API_ENDPOINT = 'https://qqmeusmrfk.execute-api.us-east-1.amazonaws.com/prod/';

class Api {
  static localStorage = window.localStorage;
  static problems = JSON.parse(Api.localStorage.getItem(API_STORAGE_KEY)) || {};

  static _updateStorage() {
    Api.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(Api.problems));
  }

  static async _getJson(path) {
    const response = await fetch(API_ENDPOINT + path);
    return await response.json();
  }

  static async getProblems(platform) {
    const options = {
      'platform': platform
    };

    var fakeResponse = [];
    for(var i = 0; i < 10000; i++) {
      fakeResponse.push({'sk': '' + Math.random(), 'code': '' + Math.random(), 'title': '' + Math.random()});
    }
    return fakeResponse;

    const path = `problems?${queryString.stringify(options)}`;
    return await Api._getJson(path);
  }

  static addProblem(problem) {
    const fakeUuid = '' + (new Date()).getTime();
    Api.problems[fakeUuid] = problem;
    Api._updateStorage();

    return fakeUuid;
  }
}

export default Api;
