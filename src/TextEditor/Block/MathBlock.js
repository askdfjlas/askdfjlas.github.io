import React, { useEffect, useMemo } from 'react';
import Utils from '../../Utils';

function MathBlock({ id, index, content, rendered }) {
  let textContent = rendered ? '\\(' + content + '\\)' : content;
  let className = rendered ? 'Askd-te-MATHJAX' : 'Askd-te-MATH';
  let position = rendered ? content.length : null;

  /* MathJax must be re-rendered when one of the following attributes change */
  let changeKey = useMemo(() => {
    return {
      id: id, rendered: rendered, blockLength: content.length
    };
  }, [ id, rendered, content.length ]);

  /* Render MathJax and put a zero-width space before and after,
  in order to help caret selection; also disable tabIndex */
  useEffect(() => {
    if(changeKey.rendered) {
      Utils.renderMathJax([`#${changeKey.id}`]);

      let blockElement = document.getElementById(changeKey.id);

      blockElement.children[0].removeAttribute('tabIndex');

      blockElement.innerHTML = String.fromCharCode(8203) +
        blockElement.innerHTML + String.fromCharCode(8203);
    }
  }, [changeKey]);

  return (
    <div className={className} id={id} index={index} position={position}>
      { textContent }
    </div>
  );
}

export default MathBlock;
