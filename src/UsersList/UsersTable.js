import React from 'react';
import Username from '../Misc/Username';
import '../css/UsersTable.css';

const PAGE_SIZE = 50;

function UsersTable({ currentPage, lastUpdated, users }) {
  const updatedTime = (new Date(lastUpdated)).toLocaleString();

  let userRows = [];
  let index = (currentPage - 1) * PAGE_SIZE + 1;
  for(const user of users) {
    let contributionClassName = user.contribution > 0 ?
      'Users-table-contributor' : '';
    contributionClassName += ' Users-table-contribution';

    userRows.push(
      <tr key={index}>
        <td>{index}</td>
        <td className="Users-table-username">
          <Username username={user.username} rank={user.cfRank} />
        </td>
        <td className={contributionClassName}>{user.contribution}</td>
      </tr>
    );
    index++;
  }

  return (
    <div className="Users-table">
      <div className="Users-table-table">
        <div className="Users-table-table-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th className="Users-table-username">Username</th>
                <th className="Users-table-contribution">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {userRows}
            </tbody>
          </table>
        </div>
      </div>
      <span className="Users-table-last-updated">
        Last updated on {updatedTime}
      </span>
    </div>
  );
}

export default UsersTable;
