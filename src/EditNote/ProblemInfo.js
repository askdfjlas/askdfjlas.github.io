import React, { Component } from 'react';

class ProblemInfo extends Component {
  render() {
    const info = this.props.info;

    return (
      <div className="Edit-note-problem-info">
        {
          info &&
          <div className="Module-info-box">
            <h4>
              {this.props.platform} {info.problemCode} - {info.problemName}
            </h4>
            <p className="Edit-note-contest">{info.contestName}</p>
            <a className="Askd-form-link" href={info.link}>Problem link</a>
          </div>
        }
      </div>
    );
  }
}

export default ProblemInfo;
