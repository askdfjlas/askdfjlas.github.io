import React from 'react';
import SearchSelect from './SearchSelect';
import UsersApi from '../Api/UsersApi';

function SearchUserSelect({ callback }) {
  return (
    <div className="Askd-form Users-table-search">
      <SearchSelect name='username' id='cp-username-search'
                    search={UsersApi.getSearchUsers} staticKey='username'
                    network={true} placeholder='Search by username'
                    callback={callback} />
    </div>
  );
}

export default SearchUserSelect;
