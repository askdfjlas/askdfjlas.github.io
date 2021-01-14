import React from 'react';
import CreateLoadingComponent from '../HOC/CreateLoadingComponent';
import Paginator from '../Paginator/Paginator';
import UsersTable from './UsersTable';
import LoadState from '../Enum/LoadState';
import UsersApi from '../Api/UsersApi';

async function getUsers(props, page) {
  const usersInfo = await UsersApi.getUsers(page);
  return {
    usersInfo: usersInfo
  };
}

function UsersList({ info, loadInfo, screen, currentParams }) {
  const usersInfo = info.usersInfo;

  if(screen === LoadState.NOT_FOUND) {
    return (
      <div className="Module-description">
        Page not found!
      </div>
    );
  }
  else {
    const paginator = (
      <Paginator currentPage={currentParams} totalPages={usersInfo.totalPages}
                 callback={loadInfo} />
    );

    return (
      <div className="Module-space">
        { paginator }
        <UsersTable currentPage={currentParams} users={usersInfo.users}
                    lastUpdated={usersInfo.lastUpdated} />
        { paginator }
      </div>
    );
  }
}

export default CreateLoadingComponent(
  getUsers, 1, 'PageNotFound', UsersList
);
