import React, { Component } from 'react';

class MathBlock extends Component {
  render() {
    let content = this.props.block.c;

    return (
      <div className="Askd-te-MATH" id={this.props.id} index={this.props.index}
           tabIndex="0" onBlur={this.handleBlur} onFocus={this.handleFocus}>
        { content }
      </div>
    );
  }
}

export default MathBlock;
