import React, { useEffect, useMemo } from 'react';
import Utils from '../../Utils';

function MathBlock({ id, index, block, rendered }) {
  let content = rendered ? '\\(' + block.c + '\\)' : block.c;
  let className = rendered ? 'Askd-te-MATHJAX' : 'Askd-te-MATH';
  let position = rendered ? block.c.length : null;

  let changeKey = useMemo(() => {
    return {
      id: id, rendered: rendered
    };
  }, [ id, rendered ]);

  useEffect(() => {
    if(changeKey.rendered) {
      Utils.renderMathJax([`#${changeKey.id}`]);
    }
  }, [changeKey]);

  return (
    <div className={className} id={id} index={index} position={position}>
      { content }
    </div>
  );
}

export default MathBlock;
