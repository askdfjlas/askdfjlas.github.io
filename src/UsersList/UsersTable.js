import React from 'react';
import { Link } from 'react-router-dom';
import '../css/UsersTable.css';

const PAGE_SIZE = 50;

function UsersTable({ currentPage, lastUpdated, users }) {
  const updatedTime = (new Date(lastUpdated)).toLocaleString();

  let userRows = [];
  let index = (currentPage - 1) * PAGE_SIZE + 1;
  for(const user of users) {
    const contributionClassName = user.contribution > 0 ?
      'Users-table-contributor' : '';

    userRows.push(
      <tr key={index}>
        <td>{index}</td>
        <td className="Users-table-username">
          <Link className="Askd-button Askd-button-generic" to={`/users/${user.username}`}>
            {user.username}
          </Link>
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
            <tbody>
              <tr>
                <th>#</th>
                <th className="Users-table-username">Username</th>
                <th>Contribution</th>
              </tr>
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
