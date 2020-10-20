import Api from './Api';

class ProblemsApi {
  static _prettifyProblems(problems) {
    for(let i = 0; i < problems.length; i++) {
      problems[i].prettySk = problems[i].sk.replaceAll('#', '');
    }
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

    let problems = await Api.getJson('problems', options);
    ProblemsApi._prettifyProblems(problems);

    return problems;
  }
}

export default ProblemsApi;
