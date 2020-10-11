import React from 'react';

function UserInfo({ info }) {
  return (
    <>
      <h2>{info.username}</h2>
      {
        info.email &&
        <p>Email: {info.email} (only visible to you)</p>
      }
    </>
  );
}

export default UserInfo;
