import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderAuth from './HeaderAuth';
import Utils from '../Utils';
import '../css/Header.css';

function Header() {
  let title = 'cp-notes!';
  if(Utils.whatStageIsThis() === 'beta') {
    title += ' beta';
  }

  const path = useLocation().pathname;
  const big = (path === '/' || path === '/home');
  const outerClassName = big ? 'Header' : 'Header-small';

  return (
    <div className={outerClassName}>
      { big && <h1>{title}</h1> }
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/notes">Notes</Link>
        </li>
      </ul>
      <HeaderAuth />
    </div>
  );
}

export default Header;
