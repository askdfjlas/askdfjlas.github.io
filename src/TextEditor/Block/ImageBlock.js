import React, { useState, useEffect, useRef } from 'react';
import Utils from '../../Utils';

function ImageBlock({ id, index, caretSelected, editable, initialLink,
                      initialSize, handleBlockUpdate }) {
  const [ selected, setSelected ] = useState(false);
  const [ imageLink, setImageLink ] = useState(initialLink || '');
  const [ validImageLink, setValidImageLink ] = useState(initialLink || null);
  const [ imageSize, setImageSize ] = useState(initialSize || 836);
  const lastValidImageLinkTime = useRef(0);
  const blockRef = React.createRef();

  useEffect(() => {
    setImageLink(initialLink || '');
    setValidImageLink(initialLink || null);
  }, [initialLink]);

  useEffect(() => {
    setImageSize(initialSize);
  }, [initialSize]);

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

  const handleSizeChange = async (event) => {
    const newSize = event.target.value;

    handleBlockUpdate({
      imageUpdate: {
        index: index,
        size: newSize
      }
    });
    setImageSize(newSize);
  };

  if(!editable) {
    handleFocus = null;
    handleBlur = null;
  }

  return (
    <div className="Askd-te-IMAGE" id={id} index={index} tabIndex="0"
         contentEditable={false} onFocus={handleFocus} onBlur={handleBlur}
         ref={blockRef} style={{width: imageSize * imageSize / 10000 + '%'}}>
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
          <label htmlFor="Askd-te-IMAGE-size">Size</label>
          <input type="range" name="Askd-te-IMAGE-size"
                 min="200" max="1000" value={imageSize} onChange={handleSizeChange}
                 disabled={!validImageLink} />
        </div>
      }
    </div>
  );
}

export default ImageBlock;
