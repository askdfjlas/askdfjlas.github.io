import React from 'react';
import { Link } from 'react-router-dom';
import HeaderAuth from './HeaderAuth';
import '../css/Header.css';

function Header() {
  return (
    <div className="Header">
      <h1>cp-notes beta</h1>
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
