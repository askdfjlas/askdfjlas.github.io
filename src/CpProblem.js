import React, { Component } from 'react';
import Utils from './Utils';
import './css/CpProblem.css';

const SOLVED_CLASS = [
  'Cp-unsolved',
  'Cp-solved',
  'Cp-solved-help'
];

class CpProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotes: false
    };

    this.toggleNotes = this.toggleNotes.bind(this);
  }

  toggleNotes() {
    Utils.setStatePromise(this, {
      showNotes: !this.state.showNotes
    });
  }

  render() {
    const problem = this.props.problem;
    const showHide = this.state.showNotes ? 'hide' : 'show';

    return (
      <div className={`Cp-problem ${SOLVED_CLASS[problem.solved]}`}>
        <h4>{ `${problem.platform} ${problem.code} - ${problem.title}` }</h4>
        <p>
          Problem link: <a href={problem.link}>{problem.link}</a>
        </p>
        <p className="Cp-problem-toggle" onClick={this.toggleNotes}>
          Notes ({ showHide })
        </p>
        <p className={`Cp-problem-notes-${showHide}`}>
          { problem.notes || 'Nothing written here yet!'}
        </p>
      </div>
    );
  }
}

export default CpProblem;
