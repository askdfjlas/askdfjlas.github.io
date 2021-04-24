import React, { useState } from 'react';
import NotesList from './NotesList';
import SearchUserSelect from '../SearchSelect/SearchUserSelect';
import SearchProblemSelect from '../SearchSelect/SearchProblemSelect';
import SeeOtherNotes from '../Misc/SeeOtherNotes';
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
  const sortByRecent = urlParams.recent;

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
      page: null,
      username: null,
      platform: null,
      contestId: null,
      problemId: null
    });
  }

  const changePage = (newPage) => {
    if(newPage === 1) {
      newPage = null;
    }

    changeSearchAttributes({
      page: newPage
    });
  };

  const changeUsername = (newUsername) => {
    changeSearchAttributes({
      username: newUsername,
      page: null
    });
  }

  const changePlatformContestOrProblem = (platform, contestId, problemId) => {
    changeSearchAttributes({
      platform: platform,
      contestId: contestId,
      problemId: problemId,
      page: null
    });
  };

  let [ showFilterForm, setShowFilterForm ] = useState(false);
  const toggleFilterForm = () => {
    setShowFilterForm(!showFilterForm);
  };

  if(sortByRecent && showFilterForm) {
    setShowFilterForm(false);
  }

  const changeSort = (event) => {
    const newSort = event.target.value;
    if(newSort === 'Recent') {
      changeSearchAttributes({
        username: null,
        platform: null,
        contestId: null,
        problemId: null,
        page: null,
        recent: 1
      });
    }
    else {
      changeSearchAttributes({
        page: null,
        recent: null
      });
    }
  };

  const headingText = sortByRecent ? 'Most recent notes' : 'Most liked notes';
  const toggleFilterFormText = showFilterForm ? 'Hide this' :
    'Want to filter by username, platform, contest, or problem?';

  const skipContestSearch = !!problemId && !contestId;

  const showSeeOtherNotes = !!platform || !!username;

  return (
    <div className="Notes-search">
      <h2 className="Module-heading">
        {headingText}
      </h2>
      {
        showSeeOtherNotes &&
        <SeeOtherNotes platform={platform} contestId={contestId}
                       problemId={problemId} goDownOneLevel={!username} />
      }
      <button onClick={toggleFilterForm} disabled={sortByRecent}
              className="Notes-search-filter Askd-form-link">
        {toggleFilterFormText}
      </button>
      <div className="Notes-search-sort">
        <label htmlFor="search-sort">Sort by</label>
        <select value={sortByRecent ? 'Recent' : 'Likes'} name="search-sort"
                onChange={changeSort}>
          <option value="Likes">Most Liked</option>
          <option value="Recent">Recent</option>
        </select>
      </div>
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
                 problemId={problemId} page={page} sortByRecent={sortByRecent}
                 pageChangeCallback={changePage} />
    </div>
  );
}

export default NotesSearch;
