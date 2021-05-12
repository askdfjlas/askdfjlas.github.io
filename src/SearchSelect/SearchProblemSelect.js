import React, { useState, useEffect } from 'react';
import ProblemsApi from '../Api/ProblemsApi';
import SearchSelect from './SearchSelect';

const NO_SEARCH_CODE_CONTEST_PLATFORMS = ['Project Euler', 'Kattis', 'yukicoder'];
const NO_SEARCH_CODE_PROBLEM_PLATFORMS = ['TopCoder', 'Kattis'];

function SearchProblemSelect({ initialPlatform, initialContestId,
                               initialProblemId, initialSkipContestSearch,
                               changeCallback }) {
  let [ platform, setPlatform ] = useState(initialPlatform);
  let [ contestSk, setContestSk ] = useState(initialContestId);
  let [ skipContestSearch, setSkipContestSearch ] =
    useState(initialSkipContestSearch);

  let handlePlatformChange = (event) => {
    setPlatform(event.target.value);
    setContestSk(null);
    changeCallback(event.target.value, null, null);
  };

  let updateContestSortKey = (newContestSk) => {
    setContestSk(newContestSk);
    changeCallback(platform, newContestSk, null);
  };

  let updateProblemSortKey = (newProblemSk) => {
    changeCallback(platform, contestSk, newProblemSk);
  };

  let toggleSkipContestSearch = () => {
    setSkipContestSearch(!skipContestSearch);
    setContestSk(null);
  };

  let searchContestFunction = null;
  let searchContestStaticKey = null;
  if(platform && !skipContestSearch) {
    searchContestFunction = () => ProblemsApi.getContests(platform);
    searchContestStaticKey = platform;
  }

  let searchProblemFunction = null;
  let searchProblemStaticKey = null;
  if(platform && contestSk) {
    searchProblemFunction = () => ProblemsApi.getProblems(platform, contestSk);
    searchProblemStaticKey = platform + contestSk;
  }
  else if(platform && skipContestSearch) {
    searchProblemFunction = () => ProblemsApi.getProblems(platform);
    searchProblemStaticKey = platform;
  }

  let searchContestKeys, searchProblemKeys;
  if(NO_SEARCH_CODE_CONTEST_PLATFORMS.includes(platform)) {
    searchContestKeys = ['name'];
  }
  else {
    searchContestKeys = ['contestCode', 'name'];
  }

  if(NO_SEARCH_CODE_PROBLEM_PLATFORMS.includes(platform)) {
    searchProblemKeys = ['name'];
  }
  else {
    searchProblemKeys = ['problemCode', 'name'];
  }

  const selectPlatformValue = platform ? platform : '';
  const skipButtonText = skipContestSearch ? 'Want to filter by contest?' :
                                             'Want to skip filtering by contest?';

  useEffect(() => {
    if(initialContestId) {
      setSkipContestSearch(false);
    }
    if(initialProblemId && !initialContestId) {
      setSkipContestSearch(true);
    }

    setPlatform(initialPlatform);
    setContestSk(initialContestId);
  }, [initialPlatform, initialContestId, initialProblemId]);

  return (
    <div className="Search-problem-select">
      <label htmlFor="cp-platform">Platform</label>
      <select value={selectPlatformValue} onChange={handlePlatformChange}
              name="platform" id="cp-platform">
        <option disabled value=""></option>
        <option value="CodeForces">CodeForces</option>
        <option value="CodeChef">CodeChef</option>
        <option value="AtCoder">AtCoder</option>
        <option value="TopCoder">TopCoder</option>
        <option value="Project Euler">Project Euler</option>
        <option value="ICPC">ICPC World Finals</option>
        <option value="Kattis">Kattis</option>
        <option value="yukicoder">yukicoder</option>
      </select>

      <label htmlFor="cp-contest">Contest</label>
      <SearchSelect name='contest' id='cp-contest' search={searchContestFunction}
                    keys={searchContestKeys} callback={updateContestSortKey}
                    displayKey='name' staticKey={searchContestStaticKey}
                    initialSearchSortKey={searchContestStaticKey && initialContestId}
                    reverseSearch={true} />

      <button onClick={toggleSkipContestSearch}
              type="button" className="Askd-form-link Askd-form-link-separator">
        { skipButtonText }
      </button>

      <label htmlFor="cp-title">Problem</label>
      <SearchSelect name='title' id='cp-title' search={searchProblemFunction}
                    keys={searchProblemKeys} callback={updateProblemSortKey}
                    displayKey='name' staticKey={searchProblemStaticKey}
                    initialSearchSortKey={searchProblemStaticKey && initialProblemId} />
    </div>
  );
}

export default SearchProblemSelect;
