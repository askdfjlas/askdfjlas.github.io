import React from 'react';
import CpNotes from '../Home/CpNotes';

function Home({ history }) {
  if(window.location.href.includes('?')) {
    const urlSegments = window.location.href.split('?').splice(1);
    const correctPath = urlSegments.join('').split('#').join('/');
    history.replace(correctPath);
  }

  return (
    <CpNotes />
  );
}

export default Home;
