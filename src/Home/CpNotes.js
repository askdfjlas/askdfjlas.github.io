import React, { Component } from 'react';
import '../css/CpNotes.css';

class CpNotes extends Component {
  async componentDidMount() {
    if(!window.MathJax)
      return;

    await window.MathJax.typesetPromise();
  }

  render() {
    return (
      <div className="Module-wrapper">
        <div className="Module-description Module-description-centered">
          <p>A work-in-progress web application for storing publicly
          accessible competitive programming notes! \[\LaTeX\]</p>
        </div>
      </div>
    );
  }
}

export default CpNotes;
