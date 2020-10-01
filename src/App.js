import React from 'react';
import Header from './Header/Header';
import CpNotes from './CpNotes';
import './css/App.css';
import './css/Module.css';
import './css/Form.css';
import './fonts/fonts.css';

function App() {
  return (
    <div className="App">
      <Header />
      <CpNotes />
    </div>
  );
}

export default App;
