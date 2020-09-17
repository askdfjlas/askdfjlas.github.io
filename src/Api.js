const API_STORAGE_KEY = 'askdfjlas.github.io';

class Api {
  static localStorage = window.localStorage;
  static problems = JSON.parse(Api.localStorage.getItem(API_STORAGE_KEY)) || {};

  static _updateStorage() {
    Api.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(Api.problems));
  }

  static getProblems() {
    return Api.problems;
  }

  static addProblem(problem) {
    const fakeUuid = '' + (new Date()).getTime();
    Api.problems[fakeUuid] = problem;
    Api._updateStorage();

    return fakeUuid;
  }
}

export default Api;
