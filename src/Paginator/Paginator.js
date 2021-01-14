import React from 'react';
import '../css/Paginator.css';

function Paginator({ currentPage, totalPages, callback }) {
  let pageIndices = [ currentPage ];

  let after = currentPage + 1;
  let increment = 2;
  while(after < totalPages) {
    pageIndices.push(after);
    after += increment;
    increment *= 2;
  }

  let before = currentPage - 1;
  increment = 2;
  while(before > 1) {
    pageIndices.push(before);
    before -= increment;
    increment *= 2;
  }

  if(currentPage !== 1)
    pageIndices.push(1);
  if(currentPage !== totalPages && totalPages > 1)
    pageIndices.push(totalPages);

  pageIndices.sort((a, b) => a - b);

  let paginatorButtons = [];
  for(const pageIndex of pageIndices) {
    const buttonClassName = (pageIndex === currentPage) ?
      'Paginator-list-selected' : 'Askd-form-link';
    const buttonOnClick = (pageIndex === currentPage) ?
      null : () => callback(pageIndex);

    paginatorButtons.push(
      <li key={pageIndex}>
        <button className={buttonClassName} onClick={buttonOnClick}>
          {pageIndex}
        </button>
      </li>
    );
  }

  return (
    <div className="Paginator">
      <ul className="Paginator-list">
        { paginatorButtons }
      </ul>
    </div>
  );
}

export default Paginator;
