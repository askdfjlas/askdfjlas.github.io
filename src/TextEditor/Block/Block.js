import React, { Component } from 'react';
import ContentType from '../ContentType';
import MaskManager from '../MaskManager';
import MathBlock from './MathBlock';
import ImageBlock from './ImageBlock';

class Block extends Component {
  render() {
    const block = this.props.block;
    const editorId = this.props.id;
    const selected = this.props.selected;
    const index = this.props.index;
    const content = block.c;
    const blockId = editorId + index;

    if(block.m === ContentType.MATH) {
      return (
        <MathBlock id={blockId} rendered={!selected} content={content}
                   index={index} />
      );
    }
    else if(block.m === ContentType.IMAGE) {
      return (
        <ImageBlock id={blockId} initialLink={block.l} selected={selected}
                    index={index} handleBlockUpdate={this.props.handleBlockUpdate} />
      );
    }

    return (
      <div className={MaskManager.getClassName(block.m)} id={blockId}
           index={index}>
        {content}
      </div>
    );
  }
}

export default Block;
