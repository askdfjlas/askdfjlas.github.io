import React, { useState } from 'react';

function ImageBlock({ id, index, link, handleBlockUpdate }) {
  let [ selected, setSelected ] = useState(false);
  const blockRef = React.createRef();

  const handleClick = (event) => {
    event.preventDefault();

    handleBlockUpdate({
      ignoreNextSelectionChange: true
    });

    setSelected(true);
    blockRef.current.focus();
  };

  const handleBlur = (event) => {
    setSelected(false);
  }

  return (
    <div className="Askd-te-IMAGE" id={id} index={index} tabIndex="-1"
         onPointerDown={handleClick} onBlur={handleBlur} ref={blockRef}>
      !
      { selected && "this is the menubar"}
    </div>
  );
}

export default ImageBlock;
