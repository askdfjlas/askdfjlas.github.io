import React, { Component } from 'react';
import ProblemsApi from '../Api/ProblemsApi';

class ProblemInfo extends Component {
  render() {
    const info = this.props.info;
    const problemDisplayName = ProblemsApi.getProblemDisplayName(info);

    return (
      <div className="Edit-note-problem-info">
        <div className="Module-info-box">
          <h4>
            { problemDisplayName }
          </h4>
          <p className="Edit-note-contest">{info.contestName}</p>
          <a className="Askd-form-link" href={info.link} target="_blank"
             rel="noopener noreferrer">
            Problem link
          </a>
        </div>
      </div>
    );
  }
}

export default ProblemInfo;
