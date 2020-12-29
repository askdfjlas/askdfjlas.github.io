import React, { Component } from 'react';
import ContentType from '../ContentType';
import MathBlock from './MathBlock';

function getClassName(mask) {
  let className = '';
  for(const style in ContentType) {
    if(mask & ContentType[style]) {
      className += `Askd-te-${style} `;
    }
  }
  return className;
}

class Block extends Component {
  render() {
    const block = this.props.block;
    const editorId = this.props.id;
    const index = this.props.index;
    const selected = this.props.selected;

    if(block.m === ContentType.MATH) {
      return (
        <MathBlock id={editorId + index} rendered={!selected} block={block}
                   index={index} />
      );
    }

    return (
      <div className={getClassName(block.m)} id={editorId + index} index={index}>
        { block.c }
      </div>
    );
  }
}

export default Block;
