import Api from './Api';
import SolvedState from './SolvedState';

class ProblemsApi {
  static _prettifyProblems(problems) {
    for(let i = 0; i < problems.length; i++) {
      problems[i].prettySk = problems[i].sk.replaceAll('#', '');
    }
  }

  static async getContests(platform) {
    const options = {
      platform: platform
    };

    return await Api.getJson('contests', options);
  }

  static async getProblems(platform, contestId) {
    const options = {
      platform: platform,
      contestId: contestId
    };

    let problems = await Api.getJson('problems', options);
    ProblemsApi._prettifyProblems(problems);

    return problems;
  }

  static async getProblemInfo(platform, problemId) {
    const options = {
      platform: platform,
      problemId: problemId
    };

    return await Api.getJson('problems', options);
  }

  static getSolvedStateText(solvedStateValue) {
    solvedStateValue = parseInt(solvedStateValue);
    for(const state in SolvedState) {
      if(SolvedState[state].value === solvedStateValue) {
        return SolvedState[state].text;
      }
    }
  }
}

export default ProblemsApi;
