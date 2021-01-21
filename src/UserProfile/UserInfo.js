import React from 'react';
import Utils from '../Utils';
import '../css/UserInfo.css';

function UserInfo({ info }) {
  const imageSource = Utils.getImageSourceFromBase64(
    info.avatarData, info.avatarExtension
  );

  const contributionClassName = info.contribution > 0 ?
    'Users-table-contributor' : '';

  return (
    <>
      <h2 className="Module-heading">{info.username}</h2>
      <div className="Module-outer-space User-info">
        <div className="User-info-info">
          {
            info.email &&
            <p>Email: {info.email} (only visible to you)</p>
          }
          <p>Contribution:
            <span className={contributionClassName}>
              {info.contribution}
            </span>
          </p>
          <p>{`Total notes: ${info.totalNotes}`}</p>
          <p>Registered: ?</p>
        </div>
        <div className="User-info-avatar-outer">
          <div className="User-info-avatar">
            <img src={imageSource} alt="Avatar" />
            <label htmlFor="User-avatar-upload">
              Change avatar
            </label>
            <input id="User-avatar-upload" name="avatar" type="file"
                   accept="image/jpeg, image/png" />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
