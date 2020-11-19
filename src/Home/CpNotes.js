import React, { Component } from 'react';
import TextEditor from '../TextEditor/TextEditor';
import Utils from '../Utils';

class CpNotes extends Component {
  async componentDidMount() {
    await Utils.renderMathJax();
  }

  render() {
    return (
      <div className="Module-wrapper">
        <div className="Module-description Module-description-centered">
          <p>A work-in-progress web application for storing publicly
          accessible competitive programming notes! \[\LaTeX\]</p>
        </div>
        <TextEditor />
      </div>
    );
  }
}

export default CpNotes;
