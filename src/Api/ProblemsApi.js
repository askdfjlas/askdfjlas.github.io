const API_STORAGE_KEY = 'askdfjlas.github.io';

class ProblemsApi {
  static localStorage = window.localStorage;
  static problems = JSON.parse(ProblemsApi.localStorage.getItem(API_STORAGE_KEY)) || {};

  static _updateStorage() {
    ProblemsApi.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(ProblemsApi.problems));
  }

  static async getProblems(platform) {
    /*
    const options = {
      'platform': platform
    };
    */

    var fakeResponse = [];
    for(var i = 0; i < 10000; i++) {
      fakeResponse.push({'sk': '' + Math.random(), 'code': '' + Math.random(), 'title': '' + Math.random()});
    }
    return fakeResponse;

    /*
    const path = `problems?${queryString.stringify(options)}`;
    return await ProblemsApi._getJson(path);
    */
  }

  static addProblem(problem) {
    const fakeUuid = '' + (new Date()).getTime();
    ProblemsApi.problems[fakeUuid] = problem;
    ProblemsApi._updateStorage();

    return fakeUuid;
  }
}

export default ProblemsApi;
