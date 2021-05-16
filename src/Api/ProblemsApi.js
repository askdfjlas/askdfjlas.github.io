import Api from './Api';
import Utils from '../Utils';
import SolvedState from '../Enum/SolvedState';

const MANY_PROBLEM_PLATFORMS = ['Project Euler', 'Kattis', 'yukicoder', 'DMOJ'];

class ProblemsApi {
  static getProblemDisplayNameWithoutPlatform(info) {
    if(info.platform === 'CodeChef') {
      return `${info.contestCode} ${info.problemCode} - ${info.problemName}`;
    }
    if(info.platform === 'TopCoder') {
      const divisionLevel = 3 - Math.ceil(info.level/3);
      const problemLevel = (info.level - 1) % 3 + 1;
      const divisionString = `Division ${divisionLevel} Level ${problemLevel}`;
      return `${divisionString} - ${info.problemName}`;
    }
    if(info.platform === 'Kattis' || info.platform === 'DMOJ') {
      return `- ${info.problemName}`;
    }
    return `${info.problemCode} - ${info.problemName}`;
  }

  static getProblemDisplayName(info) {
    const afterText = ProblemsApi.getProblemDisplayNameWithoutPlatform(info);
    return `${info.platform} ${afterText}`
  }

  static getContestDisplayName(info) {
    const lowerCaseContestName = info.contestName.toLowerCase();
    const lowerCasePlatform = info.platform.toLowerCase();
    if(lowerCaseContestName.includes(lowerCasePlatform)) {
      return info.contestName;
    }
    return `${info.platform} - ${info.contestName}`;
  }

  static getProblemLetter(info) {
    if(MANY_PROBLEM_PLATFORMS.includes(info.platform)) {
      const inflatedProblemLetter = info.problemSk.split('#')[1];
      return Utils.removePrefixZeroes(inflatedProblemLetter);
    }
    return info.problemSk.split('#')[1];
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

    return await Api.getJson('problems', options);
  }

  static async getProblemInfo(platform, problemId) {
    const options = {
      platform: platform,
      problemId: problemId
    };

    let problemInfo = await Api.getJson('problems', options);
    problemInfo.problemId = problemId;
    problemInfo.platform = platform;

    return problemInfo;
  }

  static getSolvedStateText(solvedStateValue) {
    solvedStateValue = parseInt(solvedStateValue);
    for(const state in SolvedState) {
      if(SolvedState[state].value === solvedStateValue) {
        return SolvedState[state].text;
      }
    }
  }

  static getSolvedStateCssClass(solvedStateValue) {
    solvedStateValue = parseInt(solvedStateValue);
    for(const state in SolvedState) {
      if(SolvedState[state].value === solvedStateValue) {
        return SolvedState[state].css;
      }
    }
  }
}

export default ProblemsApi;
