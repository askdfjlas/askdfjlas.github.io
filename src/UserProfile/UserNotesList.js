import React, { Component } from 'react';
import UserNoteInfo from './UserNoteInfo';
import UserContestInfo from './UserContestInfo';
import UserNotesTitleDropdown from './UserNotesTitleDropdown';
import SolvedState from '../Api/SolvedState';

class UserNotesList extends Component {
  getSolvedStateText(solvedStateValue) {
    for(const state in SolvedState) {
      if(SolvedState[state].value === solvedStateValue) {
        return SolvedState[state].text;
      }
    }
  }

  renderIntoNotes(notes) {
    let noteInfoElements = [];
    for(let i = 0; i < notes.length; i++) {
      noteInfoElements.push(
        <UserNoteInfo key={i} info={notes[i]} />
      );
    }

    return noteInfoElements;
  }

  renderIntoContests(notes) {
    let contestGroups = {};
    for(const note of notes) {
      const contestString =
        `${note.platform}#${note.contestCode}#${note.contestName}`;

      if(!contestGroups.hasOwnProperty(contestString)) {
        contestGroups[contestString] = {
          contestCode: note.contestCode,
          contestName: note.contestName,
          platform: note.platform,
          notes: [ note ]
        };
      }
      else {
        contestGroups[contestString].notes.push(note);
      }
    }

    let noteInfoElements = [];
    for(const contestString in contestGroups) {
      noteInfoElements.push(
        <UserContestInfo key={contestString}
                         info={contestGroups[contestString]} />
      );
    }

    return noteInfoElements;
  }

  renderIntoSolved(notes) {
    let solvedGroups = {};
    for(const note of notes) {
      if(!solvedGroups.hasOwnProperty(note.solved)) {
        solvedGroups[note.solved] = [ note ];
      }
      else {
        solvedGroups[note.solved].push(note);
      }
    }

    let noteInfoElements = [];
    for(const solvedState in solvedGroups) {
      const solvedText = this.getSolvedStateText(parseInt(solvedState));
      const innerNotes = solvedGroups[solvedState];

      let innerContent;
      if(this.props.organizeByContest) {
        innerContent = this.renderIntoContests(innerNotes);
      }
      else {
        innerContent = this.renderIntoNotes(innerNotes);
      }

      innerContent = (
        <ul className="User-notes-list">
          { innerContent }
        </ul>
      );

      noteInfoElements.push(
        <UserNotesTitleDropdown key={solvedState} title={solvedText}
                                innerContent={innerContent} />
      );
    }

    return noteInfoElements;
  }

  render() {
    if(this.props.notes.length === 0) {
      return (
        <p>There's nothing to see here yet!</p>
      );
    }

    let noteInfoElements;
    if(this.props.organizeBySolved) {
      noteInfoElements = this.renderIntoSolved(this.props.notes);
    }
    else if(this.props.organizeByContest) {
      noteInfoElements = this.renderIntoContests(this.props.notes);
    }
    else {
      noteInfoElements = this.renderIntoNotes(this.props.notes);
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
  }
}

export default UserNotesList;
