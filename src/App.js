import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Home/Home';
import UserProfile from './UserProfile/UserProfile';
import EditProblem from './EditProblem/EditProblem';

import './css/App.css';
import './css/Module.css';
import './css/Form.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/users/:username" component={UserProfile} />
          <Route exact path="/notes/edit/:platform/:contestCode/:problemCode"
                 component={EditProblem} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
