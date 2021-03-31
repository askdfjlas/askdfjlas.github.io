import React, { useState, useEffect, useRef } from 'react';
import Utils from '../../Utils';

function ImageBlock({ id, index, initialLink, handleBlockUpdate }) {
  let [ selected, setSelected ] = useState(false);
  let [ imageLink, setImageLink ] = useState(initialLink || '');
  let [ validImageLink, setValidImageLink ] = useState(initialLink);
  let lastValidImageLinkTime = useRef(0);

  useEffect(() => {
    setImageLink(initialLink || '');
    setValidImageLink(initialLink);
  }, [index, initialLink]);

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

  const handleLinkChange = async (event) => {
    const newLink = event.target.value;
    setImageLink(newLink);

    const linkValid = await Utils.isImageLinkValid(newLink);
    if(!linkValid || Date.now() < lastValidImageLinkTime.current) {
      return;
    }

    handleBlockUpdate({
      imageUpdate: {
        index: index,
        link: newLink
      }
    });
    setValidImageLink(newLink);
    lastValidImageLinkTime.current = Date.now();
  };

  return (
    <div className="Askd-te-IMAGE" id={id} index={index} tabIndex="-1"
         contentEditable={false} onFocus={handleFocus} onBlur={handleBlur}>
      <span className="Askd-te-IMAGE-ignore">
        !
      </span>
      {
        validImageLink &&
        <img src={validImageLink} alt="Text editor block" />
      }
      {
        !validImageLink &&
        <div className="Askd-te-IMAGE-placeholder">
          <span className="icon-photo" />
        </div>
      }
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
