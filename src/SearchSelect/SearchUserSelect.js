import React from 'react';
import SearchSelect from './SearchSelect';
import UsersApi from '../Api/UsersApi';

function SearchUserSelect({ callback, initialUsername, attachLabel }) {
  const placeholderString = attachLabel ? null : 'Search by username';

  return (
    <div className="Askd-form Users-table-search">
      {
        attachLabel &&
        <label htmlFor="username">
          Username
        </label>
      }
      <SearchSelect name='username' id='cp-username-search'
                    search={UsersApi.getSearchUsers} staticKey='username'
                    network={true} placeholder={placeholderString}
                    initialSearchTerm={initialUsername}
                    callback={callback} />
    </div>
  );
}

export default SearchUserSelect;
