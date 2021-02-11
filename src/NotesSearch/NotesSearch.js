import React, { useState } from 'react';
import NotesList from './NotesList';
import SearchUserSelect from '../SearchSelect/SearchUserSelect';
import SearchProblemSelect from '../SearchSelect/SearchProblemSelect';
import queryString from 'query-string';
import '../css/NotesSearch.css';

function NotesSearch({ history }) {
  let urlParams = queryString.parse(window.location.search);
  let page = Number(urlParams.page) || 1;
  if(!(page > 0)) {
    page = 1;
  }

  const username = urlParams.username || '';
  const platform = urlParams.platform || '';
  const contestId = urlParams.contestId || '';
  const problemId = urlParams.problemId || '';

  const changeSearchAttributes = (changes) => {
    for(const attribute in changes) {
      if(changes[attribute] === null) {
        delete urlParams[attribute];
      }
      else {
        urlParams[attribute] = changes[attribute];
      }
    }
    const newQueryString = queryString.stringify(urlParams);
    history.push(`/notes?${newQueryString}`);
  };

  const resetSearch = (event) => {
    event.preventDefault();

    changeSearchAttributes({
      page: 1,
      username: null,
      platform: null,
      contestId: null,
      problemId: null
    });
  }

  const changePage = (newPage) => {
    changeSearchAttributes({
      page: newPage
    });
  };

  const changeUsername = (newUsername) => {
    changeSearchAttributes({
      username: newUsername,
      page: 1
    });
  }

  const changePlatformContestOrProblem = (platform, contestId, problemId) => {
    changeSearchAttributes({
      platform: platform,
      contestId: contestId,
      problemId: problemId,
      page: 1
    });
  };

  let [ showFilterForm, setShowFilterForm ] = useState(false);
  const toggleFilterForm = () => {
    setShowFilterForm(!showFilterForm);
  };

  const toggleFilterFormText = showFilterForm ? 'Want to hide this?' :
    'Want to filter by username, platform, contest, or problem?';

  const skipContestSearch = !!problemId && !contestId;

  return (
    <div className="Notes-search">
      <button onClick={toggleFilterForm} className="Askd-form-link">
        { toggleFilterFormText }
      </button>
      {
        showFilterForm &&
        <div className="Module-outer-space">
          <form className="Askd-form">
            <SearchUserSelect callback={changeUsername} initialUsername={username}
                              attachLabel={true} />
            <SearchProblemSelect initialPlatform={platform}
                                 initialContestId={contestId}
                                 initialProblemId={problemId}
                                 initialSkipContestSearch={skipContestSearch}
                                 changeCallback={changePlatformContestOrProblem} />
           <button onClick={resetSearch} className="Askd-form-link Notes-search-reset">
             Reset all filters
           </button>
          </form>
        </div>
      }
      <NotesList username={username} platform={platform} contestId={contestId}
                 problemId={problemId} page={page} pageChangeCallback={changePage} />
    </div>
  );
}

export default NotesSearch;
