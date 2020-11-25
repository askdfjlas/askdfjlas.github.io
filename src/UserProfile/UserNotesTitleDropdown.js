import React, { useState } from 'react';

function UserNotesTitleDropdown({ title, innerContent }) {
  const [ show, setShow ] = useState(true);
  const showText = show ? 'Hide' : 'Show';

  return (
    <li className="User-notes-title-dropdown">
      <button className="User-notes-title-dropdown-showhide Askd-form-link"
              onClick={() => setShow(!show)}>
        { showText }
      </button>
      <h4 className="User-notes-title-dropdown-heading">
        {title}
      </h4>
      { show && innerContent }
    </li>
  );
}

export default UserNotesTitleDropdown;
