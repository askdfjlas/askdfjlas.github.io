import React from 'react';

function MathBlock({ id, index, block, rendered }) {
  // let content = rendered ? '\\(' + block.c + '\\)' : block.c;
  let content = block.c;
  let className = rendered ? 'Askd-te-MATHJAX' : 'Askd-te-MATH';

  return (
    <div className={className} id={id} index={index}>
      { content }
    </div>
  );
}

export default MathBlock;
