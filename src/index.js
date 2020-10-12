import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import App from './App';
import * as serviceWorker from './serviceWorker';
import amplify_config from './amplify_config';

Amplify.configure(amplify_config);

document.body.addEventListener('mousedown', (event) => {
  document.body.classList.add('Global-mouse-click');
});

document.body.addEventListener('keydown', (event) => {
  if(event.keyCode === 9) {
    document.body.classList.remove('Global-mouse-click');
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
