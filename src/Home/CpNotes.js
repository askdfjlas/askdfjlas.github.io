import React, { Component } from 'react';
import Utils from '../Utils';

class CpNotes extends Component {
  componentDidMount() {
    Utils.renderMathJax();
  }

  render() {
    return (
      <div className="Module-description Module-description-centered">
        <p>A work-in-progress web application for storing publicly
        accessible competitive programming notes! Poggers!
        \[\LaTeX\]</p>
      </div>
    );
  }
}

export default CpNotes;
