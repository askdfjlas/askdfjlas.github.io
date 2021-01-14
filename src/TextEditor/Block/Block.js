import React, { Component } from 'react';
import ContentType from '../ContentType';
import MaskManager from '../MaskManager';
import MathBlock from './MathBlock';

class Block extends Component {
  render() {
    const block = this.props.block;
    const editorId = this.props.id;
    const selected = this.props.selected;
    const index = this.props.index;
    const content = block.c;

    if(block.m === ContentType.MATH) {
      return (
        <MathBlock id={editorId + index} rendered={!selected} content={content}
                   index={index} />
      );
    }

    return (
      <div className={MaskManager.getClassName(block.m)} id={editorId + index}
           index={index}>
        { content }
      </div>
    );
  }
}

export default Block;
