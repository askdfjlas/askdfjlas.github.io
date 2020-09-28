import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import Header from './Header';
import CpNotes from './CpNotes';
import './css/App.css';
import './css/Module.css';
import './css/Form.css';
import './fonts/fonts.css';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_nEGbUJNCV',
    userPoolWebClientId: '7vdg7biqb25e0vlnp80dktbas1'
  }
});

function App() {
  return (
    <div className="App">
      <AmplifySignOut />
      <Header />
      <CpNotes />
    </div>
  );
}

export default withAuthenticator(App);
