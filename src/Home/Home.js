import React from 'react';
import CpNotes from '../Home/CpNotes';

function Home({ history }) {
  if(window.location.href.includes('?')) {
    const correctPath = window.location.href.split('?')[1].replaceAll('#', '/');
    history.replace(correctPath);
  }

  return (
    <>
      <CpNotes />
    </>
  );
}

export default Home;
