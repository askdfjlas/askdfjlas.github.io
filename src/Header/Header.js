import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderAuth from './HeaderAuth';
import '../css/Header.css';

function Header() {
  const path = useLocation().pathname;
  const small = (path === '/' || path === '/home');
  const outerClassName = small ? 'Header' : 'Header-small';

  return (
    <div className={outerClassName}>
      { small && <h1>cp-notes beta</h1> }
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
      <HeaderAuth />
      <span className="Header-bottom"></span>
    </div>
  );
}

export default Header;
