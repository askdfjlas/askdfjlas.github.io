import React, { useState } from 'react';
import UsersApi from '../Api/UsersApi';
import LoadingSpinner from '../Misc/LoadingSpinner';
import Username from '../Misc/Username';
import Utils from '../Utils';
import '../css/UserInfo.css';

function UserInfo({ info }) {
  let [ imageLoading, setImageLoading ] = useState(false);
  let [ imageSource, setImageSource ] = useState(info.avatarData);
  let [ error, setError ] = useState('');

  let handleUpload = async (event) => {
    const file = event.target.files[0];
    const avatarData = await Utils.convertFileToBase64(file);

    if(file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setError('Error: You may only choose .png or .jpeg images!');
      return;
    }

    try {
      setImageLoading(true);
      setError('');
      await UsersApi.updateUserInfo(info.username, avatarData);
    }
    catch(err) {
      setError('Error: ' + err.message);
    }

    setImageLoading(false);
    setImageSource(avatarData);
  }

  const contributionClassName = info.contribution > 0 ?
    'Users-table-contributor' : '';

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
    <div className="Module-outer-space">
      <h2 className="Module-heading Username">{info.username}</h2>
      <div className="User-info">
        <ol className="User-info-info">
          {
            info.email &&
            <li>
              <span className="icon-envelope" />
              Email: {info.email} (only visible to you)
            </li>
          }
          <li className="User-info-info-contribution">
            <span className="icon-thumb_up_alt" />
            Contribution:
            <span className={contributionClassName}>
              {info.contribution}
            </span>
          </li>
          <li>
            <span className="icon-note-text" />
            {`Total notes: ${info.totalNotes}`}
          </li>
          {
            info.cfUsername &&
            <li>
              <span className="icon-account_box" />
              Codeforces handle:
              {' '}
              <Username username={info.cfUsername} rank={info.cfRank}
                        linkToCf={true} />
              {' '}
              <b>({info.cfRating})</b>
            </li>
          }
          { error && <li className="User-info-info-error">{error}</li> }
        </ol>
        <div className="User-info-avatar-outer">
          <div className="User-info-avatar">
            <div className="User-info-avatar-box">
              { avatarContent }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
