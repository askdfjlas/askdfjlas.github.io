import React, { useState, useEffect, useRef } from 'react';
import Utils from '../../Utils';

function ImageBlock({ id, index, caretSelected, editable,
                      initialLink, handleBlockUpdate }) {
  let [ selected, setSelected ] = useState(false);
  let [ imageLink, setImageLink ] = useState(initialLink || '');
  let [ validImageLink, setValidImageLink ] = useState(initialLink || null);
  let lastValidImageLinkTime = useRef(0);
  let blockRef = React.createRef();

  useEffect(() => {
    setImageLink(initialLink || '');
    setValidImageLink(initialLink || null);
  }, [ initialLink ]);

  let handleFocus = (event) => {
    if(selected) {
      return;
    }

    handleBlockUpdate({
      disableSelectionChange: true
    });

    blockRef.current.classList.add('Askd-te-IMAGE-focused');
    setSelected(true);
  };

  let handleBlur = (event) => {
    if(event.currentTarget.contains(event.relatedTarget)) {
      event.preventDefault();
      return;
    }

    handleBlockUpdate({
      disableSelectionChange: false
    });

    blockRef.current.classList.remove('Askd-te-IMAGE-focused');
    setSelected(false);
  };

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

  if(!editable) {
    handleFocus = null;
    handleBlur = null;
  }

  return (
    <div className="Askd-te-IMAGE" id={id} index={index} tabIndex="0"
         contentEditable={false} onFocus={handleFocus} onBlur={handleBlur}
         ref={blockRef}>
      <span className="Askd-te-IMAGE-ignore">
        !
      </span>
      {
        caretSelected &&
        <div className="Askd-te-IMAGE-blue" />
      }
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
        <div className="Askd-form Askd-te-IMAGE-toolbar">
          <label htmlFor="Askd-te-IMAGE-link">Link</label>
          <input type="text" name="Askd-te-IMAGE-link"
                 onChange={handleLinkChange} value={imageLink} />
        </div>
      }
    </div>
  );
}

export default ImageBlock;
