import React from 'react';

function UserNotesTitleDropdown({ title, innerContent, showing,
                                  colorClass, toggleCallback }) {
  const showText = showing ? 'Hide' : 'Show';

  if(!colorClass) {
    colorClass = 'default';
  }

  const headingClassName = 'User-notes-title-dropdown-heading ' +
    `User-notes-title-dropdown-heading-${colorClass}`;

  return (
    <li className='User-notes-title-dropdown'>
      <button className="User-notes-title-dropdown-showhide"
              onClick={toggleCallback}>
        { showText }
      </button>
      <h4 className={headingClassName}>
        {title}
      </h4>
      { showing && innerContent }
    </li>
  );
}

export default UserNotesTitleDropdown;
