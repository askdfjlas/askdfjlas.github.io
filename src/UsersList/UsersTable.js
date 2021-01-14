import React from 'react';
import { Link } from 'react-router-dom';
import '../css/UsersTable.css';

const PAGE_SIZE = 50;

function UsersTable({ currentPage, lastUpdated, users }) {
  const updatedTime = (new Date(lastUpdated)).toLocaleString();

  let userRows = [];
  let index = (currentPage - 1) * PAGE_SIZE + 1;
  for(const user of users) {
    userRows.push(
      <tr key={index}>
        <td>{index}</td>
        <td>
          <Link className="Askd-form-link" to={`/users/${user.username}`}>
            {user.username}
          </Link>
        </td>
        <td>{user.contribution}</td>
      </tr>
    );
    index++;
  }

  return (
    <div className="Users-table">
      <div className="Users-table-table">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Contribution</th>
            </tr>
            {userRows}
          </tbody>
        </table>
      </div>
      <span className="Users-table-last-updated">
        Last updated on {updatedTime}
      </span>
    </div>
  );
}

export default UsersTable;
