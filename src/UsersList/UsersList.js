import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import LoadingSpinner from '../Misc/LoadingSpinner';
import Paginator from '../Paginator/Paginator';
import SearchUserSelect from '../SearchSelect/SearchUserSelect';
import UsersTable from './UsersTable';
import LoadState from '../Enum/LoadState';
import UsersApi from '../Api/UsersApi';

async function getUsers(props, page) {
  const usersInfo = await UsersApi.getUsers(page);
  return {
    usersInfo: usersInfo
  };
}

function UsersList({ otherProps, info, loadInfo, screen, currentParams }) {
  let loadUserProfile = (username) => {
    otherProps.history.push(`/users/${username}`);
  };

  const usersInfo = info ? info.usersInfo : null;

  if(screen === LoadState.NOT_FOUND) {
    return (
      <div className="Module-description">
        Page not found!
      </div>
    );
  }
  else if(screen === LoadState.LOADING) {
    return (
      <>
        <SearchUserSelect callback={loadUserProfile} />
        <div className="Module-space">
          <LoadingSpinner />
        </div>
      </>
    );
  }
  else {
    const paginator = (
      <Paginator currentPage={currentParams} totalPages={usersInfo.totalPages}
                 callback={loadInfo} />
    );

    return (
      <>
        <SearchUserSelect callback={loadUserProfile} />
        <div className="Module-space">
          { paginator }
          <UsersTable currentPage={currentParams} users={usersInfo.users}
                      lastUpdated={usersInfo.lastUpdated} />
          { paginator }
        </div>
      </>
    );
  }
}

export default CreateLoadingComponent(
  getUsers, 1, 'PageNotFound', UsersList
);
