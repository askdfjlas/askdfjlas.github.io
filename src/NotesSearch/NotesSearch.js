import React from 'react';
import NotesList from './NotesList';
import queryString from 'query-string';

function NotesSearch({ history }) {
  let urlParams = queryString.parse(window.location.search);
  let page = Number(urlParams.page) || 1;
  if(page <= 0) {
    page = 1;
  }

  let changePage = (newPage) => {
    urlParams.page = newPage;
    const newQueryString = queryString.stringify(urlParams);
    history.push(`/notes?${newQueryString}`);
  };

  return (
    <div className="Module-wrapper">
      <NotesList page={page} pageChangeCallback={changePage} />
    </div>
  );
}

export default NotesSearch;
