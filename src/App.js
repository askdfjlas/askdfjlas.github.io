import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Home/Home';
import UserProfile from './UserProfile/UserProfile';
import EditNote from './EditNote/EditNote';
import PublicNote from './PublicNote/PublicNote';
import UsersList from './UsersList/UsersList';
import NotesSearch from './NotesSearch/NotesSearch';

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
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/notes" component={NotesSearch} />
          <Route exact path="/users/:username" component={UserProfile} />
          <Route exact path="/notes/edit/:platform/:contestId/:problemCode"
                 component={EditNote} />
          <Route exact path="/notes/:ownerUsername/:platform/:contestId/:problemCode"
                 component={PublicNote} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
