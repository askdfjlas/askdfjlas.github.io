import React from 'react';
import copy from 'copy-to-clipboard';
import '../css/Misc/ClipboardCopy.css';

function ClipboardCopy({ text }) {
  const innerDivRef = React.createRef();

  const handleClick = () => {
    innerDivRef.current.classList.add('Clipboard-copy-clicked');
    window.setTimeout(() => {
      innerDivRef.current.classList.remove('Clipboard-copy-clicked');
    }, 500);

    copy(text);
  }

  return (
    <div className="Clipboard-copy" onClick={handleClick}>
      {text}
      <div ref={innerDivRef}>
        Copied!
      </div>
    </div>
  );
}

export default ClipboardCopy;
