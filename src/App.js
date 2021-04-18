import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Home/Home';
import UserProfile from './UserProfile/UserProfile';
import EditNote from './EditNote/EditNote';
import PublicNote from './PublicNote/PublicNote';
import UsersList from './UsersList/UsersList';
import NotesSearch from './NotesSearch/NotesSearch';
import RecentNotesList from './Misc/RecentNotesList';
import UserSettings from './UserSettings/UserSettings';
import TextEditorDemo from './TextEditor/TextEditorDemo';

import './css/General/App.css';
import './css/General/Module.css';
import './css/General/Form.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="Module-wrapper">
          <div className="Module-content-left">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/users" component={UsersList} />
              <Route exact path="/notes" component={NotesSearch} />
              <Route exact path="/settings" component={UserSettings} />
              <Route exact path="/users/:username" component={UserProfile} />
              <Route exact path="/notes/edit/:platform/:contestId/:problemCode"
                     component={EditNote} />
              <Route exact path="/notes/:ownerUsername/:platform/:contestId/:problemCode"
                     component={PublicNote} />
              <Route exact path="/demo" component={TextEditorDemo} />
            </Switch>
          </div>
          <RecentNotesList />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
