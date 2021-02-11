import React, { Component } from 'react';

class ProblemInfo extends Component {
  static getProblemDisplayName(platform, problemCode, problemName) {
    return `${platform} ${problemCode} - ${problemName}`;
  }

  render() {
    const info = this.props.info;
    const problemDisplayName = ProblemInfo.getProblemDisplayName(
      this.props.platform, info.problemCode, info.problemName
    );

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
