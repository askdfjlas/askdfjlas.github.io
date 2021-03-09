import React, { useState } from 'react';
import UsersApi from '../Api/UsersApi';
import LoadingSpinner from '../Misc/LoadingSpinner';
import Utils from '../Utils';
import '../css/UserInfo.css';

function UserInfo({ info }) {
  let [ imageLoading, setImageLoading ] = useState(false);
  let [ imageSource, setImageSource ] = useState(Utils.getImageSourceFromBase64(
    info.avatarData, info.avatarExtension
  ));
  let [ error, setError ] = useState('');

  const contributionClassName = info.contribution > 0 ?
    'Users-table-contributor' : '';

  let handleUpload = async (event) => {
    const file = event.target.files[0];
    const avatarData = await Utils.convertFileToBase64(file);

    let avatarExtension;
    if(file.type === 'image/png') avatarExtension = 'png';
    else if(file.type === 'image/jpeg') avatarExtension = 'jpg';
    else {
      setError('Error: You may only choose .png or .jpg images!');
      return;
    }

    try {
      setImageLoading(true);
      setError('');
      await UsersApi.updateUserInfo(info.username, avatarData, avatarExtension);
    }
    catch(err) {
      setError('Error: ' + err.message);
    }

    setImageLoading(false);
    setImageSource(Utils.getImageSourceFromBase64(
      avatarData, avatarExtension
    ));
  }

  const imageContent = (
    <>
      <img src={imageSource} alt="Avatar" />
      {
        info.email &&
        <>
          <label htmlFor="User-avatar-upload" tabIndex="0">
            Change avatar
          </label>
          <input id="User-avatar-upload" name="avatar" type="file"
                 accept="image/jpeg, image/png" onChange={handleUpload} />
        </>
      }
    </>
  );
  const avatarContent = imageLoading ? <LoadingSpinner /> : imageContent;

  return (
    <>
      <div className="Module-outer-space">
        <h2 className="Module-heading Username">{info.username}</h2>
        <div className="User-info">
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
            { error && <p className="User-info-info-error">{error}</p> }
          </div>
          <div className="User-info-avatar-outer">
            <div className="User-info-avatar">
              <div className="User-info-avatar-box">
                { avatarContent }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
