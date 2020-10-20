import React, { Component } from 'react';

class EditProblem extends Component {
  async componentDidMount() {
    if(!window.MathJax)
      return;

    await window.MathJax.typesetPromise();
  }

  render() {
    return (
      <div className="Module-wrapper">
        <div className="Module-description Module-description-centered">
          <p>haha \[ penis \]</p>
        </div>
      </div>
    );
  }
}

export default EditProblem;
