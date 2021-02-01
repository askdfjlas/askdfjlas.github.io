import React from 'react';
import NotesList from './NotesList';
import SearchUserSelect from '../SearchSelect/SearchUserSelect';
import queryString from 'query-string';

function NotesSearch({ history }) {
  let urlParams = queryString.parse(window.location.search);
  let page = Number(urlParams.page) || 1;
  if(page <= 0) {
    page = 1;
  }
  let username = urlParams.username;

  let changeSearchAttributes = (changes) => {
    for(const attribute in changes) {
      urlParams[attribute] = changes[attribute];
    }
    const newQueryString = queryString.stringify(urlParams);
    history.push(`/notes?${newQueryString}`);
  };

  let changePage = (newPage) => {
    changeSearchAttributes({
      page: newPage
    });
  };

  let changeUsername = (newUsername) => {
    changeSearchAttributes({
      username: newUsername,
      page: 1
    });
  }

  return (
    <div className="Module-wrapper">
      <SearchUserSelect callback={changeUsername} />
      <NotesList username={username} page={page} pageChangeCallback={changePage} />
    </div>
  );
}

export default NotesSearch;
