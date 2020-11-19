import React, { Component } from 'react';
import UserNoteInfo from './UserNoteInfo';

class UserNotesList extends Component {
  render() {
    if(this.props.notes.length === 0) {
      return (
        <p>There's nothing to see here yet!</p>
      );
    }

    let noteInfoElements = [];
    for(let i = 0; i < this.props.notes.length; i++) {
      noteInfoElements.push(
        <UserNoteInfo key={i} info={this.props.notes[i]} />
      );
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
  }
}

export default UserNotesList;
