import React, { useState } from 'react';

function ImageBlock({ id, index, initialLink, handleBlockUpdate }) {
  let [ selected, setSelected ] = useState(false);
  let [ imageLink, setImageLink ] = useState(initialLink);

  const handleFocus = (event) => {
    if(selected) {
      return;
    }

    handleBlockUpdate({
      disableSelectionChange: true
    });
    setSelected(true);
  };

  const handleBlur = (event) => {
    if(event.currentTarget.contains(event.relatedTarget)) {
      event.preventDefault();
      return;
    }

    handleBlockUpdate({
      disableSelectionChange: false
    });
    setSelected(false);
  }

  const handleLinkChange = (event) => {
    setImageLink(event.target.value);
  };

  return (
    <div className="Askd-te-IMAGE" id={id} index={index} tabIndex="-1"
         contentEditable={false} onFocus={handleFocus} onBlur={handleBlur}>
      !
      <img src={imageLink} alt="Text editor block" />
      {
        selected &&
        <div className="Askd-te-IMAGE-toolbar">
          <label htmlFor="Askd-te-IMAGE-link">Link</label>
          <input type="text" name="Askd-te-IMAGE-link"
                 onChange={handleLinkChange} value={imageLink} />
        </div>
      }
    </div>
  );
}

export default ImageBlock;
