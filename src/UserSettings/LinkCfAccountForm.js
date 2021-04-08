import React, { useState } from 'react';
import ClipboardCopy from '../Misc/ClipboardCopy';
import UsersApi from '../Api/UsersApi';

function LinkCfAccountForm({ userInfo }) {
  const [ cfUsername, setCfUsername ] = useState('');
  const [ authCfUsername, setAuthCfUsername ] = useState('');
  const [ authId, setAuthId ] = useState(null);
  const [ beginLoading, setBeginLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const handleChange = (event) => {
    setCfUsername(event.target.value);
  };

  const beginCfVerification = async (event) => {
    event.preventDefault();
    setBeginLoading(true);
    setError(null);

    try {
      const loggedInUsername = userInfo.username;
      const verificationCode = await UsersApi.beginCfVerification(
        loggedInUsername, cfUsername
      );
      setAuthId(verificationCode);
      setAuthCfUsername(cfUsername);
    }
    catch(err) {
      if(err.name === 'UserNotFound') {
        setError(`Account ${cfUsername} not found on Codeforces!`);
      }
      else if(err.name === 'CodeForcesDown') {
        setError('Codeforces might be down. Please try again later.')
      }
      else {
        throw err;
      }
    }

    setBeginLoading(false);
  };

  const copyText = `I am authorizing cp-notes to use my identity: ${authId}`;

  return (
    <div className="Module-outer-space User-settings-cf">
      <h3 className="Module-heading">
        Codeforces account
      </h3>
      <p className="Module-paragraph">
        <i>You haven't linked your Codeforces account yet!</i>
      </p>
      <form className="Askd-form" onSubmit={beginCfVerification}>
        <label htmlFor="cfUsername">
          Codeforces username
        </label>
        <input type="text" name="cfUsername" value={cfUsername}
               onChange={handleChange} />
        <input type="submit" className="Askd-button Askd-not-fullwidth"
               value="Link your account" disabled={beginLoading} />
      </form>
      {
        authId &&
        <>
          <div className="User-settings-cf-verify">
            <p className="Module-paragraph">
              Account {authCfUsername} found! Please change the last name
              on your Codeforces profile to be the following (you may do so
              {' '}
              <a href="https://codeforces.com/settings/social" target="_blank"
                 rel="noopener noreferrer" className="Askd-form-link">
                 here
              </a>):
            </p>
            <ClipboardCopy text={copyText} />
          </div>
          <form className="Askd-form">
            <input type="submit" className="Askd-button Askd-not-fullwidth"
                   value="Verify!" disabled={beginLoading} />
          </form>
        </>
      }
      {
        error &&
        <p className="User-info-info-error">Error: {error}</p>
      }
    </div>
  );
}

export default LinkCfAccountForm;
