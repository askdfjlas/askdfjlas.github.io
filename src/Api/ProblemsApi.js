import Api from './Api';

const API_STORAGE_KEY = 'askdfjlas.github.io';

class ProblemsApi {
  static localStorage = window.localStorage;
  static problems = JSON.parse(ProblemsApi.localStorage.getItem(API_STORAGE_KEY)) || {};

  static _updateStorage() {
    ProblemsApi.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(ProblemsApi.problems));
  }

  static async getContests(platform) {
    const options = {
      'platform': platform
    };

    return await Api.getJson('contests', options);
  }

  static async getProblems(platform, contestId) {
    const options = {
      'platform': platform,
      'contestId': contestId
    };

    return await Api.getJson('problems', options);
  }

  static addProblem(problem) {
    const fakeUuid = '' + (new Date()).getTime();
    ProblemsApi.problems[fakeUuid] = problem;
    ProblemsApi._updateStorage();

    return fakeUuid;
  }
}

export default ProblemsApi;
