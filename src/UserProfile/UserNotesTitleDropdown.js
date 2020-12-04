import React from 'react';

function UserNotesTitleDropdown({ title, innerContent, showing, toggleCallback }) {
  const showText = showing ? 'Hide' : 'Show';

  return (
    <li className="User-notes-title-dropdown">
      <button className="User-notes-title-dropdown-showhide Askd-form-link"
              onClick={toggleCallback}>
        { showText }
      </button>
      <h4 className="User-notes-title-dropdown-heading">
        {title}
      </h4>
      { showing && innerContent }
    </li>
  );
}

export default UserNotesTitleDropdown;
