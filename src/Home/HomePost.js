import React from 'react';

function HomePost({ info }) {
  return (
    <>
      <h3 className="Module-heading">{info.title}</h3>
      <span className="Cp-notes-home-post-date">{info.date}</span>
      <div className="Cp-notes-home-post-content">
        { info.content }
      </div>
    </>
  );
}

export default HomePost;
