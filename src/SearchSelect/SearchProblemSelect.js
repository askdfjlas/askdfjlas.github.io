import React, { useState, useEffect } from 'react';
import ProblemsApi from '../Api/ProblemsApi';
import SearchSelect from './SearchSelect';

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
  let searchContestKey = null;
  if(platform && !skipContestSearch) {
    searchContestFunction = () => ProblemsApi.getContests(platform);
    searchContestKey = platform;
  }

  let searchProblemFunction = null;
  let searchProblemKey = null;
  if(platform && contestSk) {
    searchProblemFunction = () => ProblemsApi.getProblems(platform, contestSk);
    searchProblemKey = platform + contestSk;
  }
  else if(platform && skipContestSearch) {
    searchProblemFunction = () => ProblemsApi.getProblems(platform);
    searchProblemKey = platform;
  }

  const selectPlatformValue = platform ? platform : '';
  const skipButtonText = skipContestSearch ? 'Want to filter by contest?' :
                                             'Want to skip filtering by contest?';

  useEffect(() => {
    if(initialPlatform !== null) setPlatform(initialPlatform);
    if(initialContestId !== null) setContestSk(initialContestId);
  }, [initialPlatform, initialContestId]);

  return (
    <div className="Search-problem-select">
      <label htmlFor="cp-platform">Platform</label>
      <select value={selectPlatformValue} onChange={handlePlatformChange}
              name="platform" id="cp-platform">
        <option disabled value=""></option>
        <option value="CodeForces">CodeForces</option>
        <option value="CodeChef">CodeChef</option>
      </select>

      <label htmlFor="cp-contest">Contest</label>
      <SearchSelect name='contest' id='cp-contest' search={searchContestFunction}
                    keys={['sk', 'name']} callback={updateContestSortKey}
                    displayKey='name' staticKey={searchContestKey}
                    initialSearchSortKey={initialContestId} />

      <button onClick={toggleSkipContestSearch}
              type="button" className="Askd-form-link Askd-form-link-separator">
        { skipButtonText }
      </button>

      <label htmlFor="cp-title">Problem</label>
      <SearchSelect name='title' id='cp-title' search={searchProblemFunction}
                    keys={['prettySk', 'name']} callback={updateProblemSortKey}
                    displayKey='name' staticKey={searchProblemKey}
                    initialSearchSortKey={initialProblemId} />
    </div>
  );
}

export default SearchProblemSelect;
