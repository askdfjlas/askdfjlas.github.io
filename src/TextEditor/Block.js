import React, { Component } from 'react';
import ContentType from './ContentType';

function getClassName(mask) {
  let className = '';
  for(const style in ContentType) {
    if(mask & ContentType[style]) {
      className += style + ' ';
    }
  }
  return className;
}

class Block extends Component {
  render() {
    const block = this.props.block;
    const editorId = this.props.id;
    const index = this.props.index;

    return (
      <div className={getClassName(block.m)} id={editorId + index}
           suppressContentEditableWarning="true" index={index}>
        { block.c }
      </div>
    );
  }
}

export default Block;
