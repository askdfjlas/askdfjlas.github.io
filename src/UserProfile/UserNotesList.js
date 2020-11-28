import React, { Component } from 'react';
import UserNoteInfo from './UserNoteInfo';
import UserContestInfo from './UserContestInfo';
import UserNotesTitleDropdown from './UserNotesTitleDropdown';
import ProblemsApi from '../Api/ProblemsApi';

function compareByRecent(note1, note2) {
  if(note1.editedTime > note2.editedTime)
    return -1;
  return 1;
}

class UserNotesList extends Component {
  renderIntoNotes(notes) {
    let noteInfoElements = [];
    for(let i = 0; i < notes.length; i++) {
      noteInfoElements.push(
        <UserNoteInfo key={i} info={notes[i]} />
      );
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
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
          editedTime: note.editedTime,
          notes: [ note ]
        };
      }
      else {
        if(note.editedTime > contestGroups[contestString].editedTime) {
          contestGroups[contestString].editedTime = note.editedTime;
        }
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

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
  }

  renderIntoPlatforms(notes) {
    let platformGroups = {};
    for(const note of notes) {
      if(!platformGroups.hasOwnProperty(note.platform)) {
        platformGroups[note.platform] = [ note ];
      }
      else {
        platformGroups[note.platform].push(note);
      }
    }

    let noteInfoElements = [];
    for(const platform in platformGroups) {
      const innerNotes = platformGroups[platform];
      let innerContent = this.props.organizeByContest ?
        this.renderIntoContests(innerNotes) : this.renderIntoNotes(innerNotes);

      noteInfoElements.push(
        <UserNotesTitleDropdown key={platform} title={platform}
                                innerContent={innerContent} />
      );
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
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
      const solvedText = ProblemsApi.getSolvedStateText(parseInt(solvedState));
      const innerNotes = solvedGroups[solvedState];

      let innerContent;
      if(this.props.organizeByPlatform)
        innerContent = this.renderIntoPlatforms(innerNotes);
      else if(this.props.organizeByContest)
        innerContent = this.renderIntoContests(innerNotes);
      else
        innerContent = this.renderIntoNotes(innerNotes);

      noteInfoElements.push(
        <UserNotesTitleDropdown key={solvedState} title={solvedText}
                                innerContent={innerContent} />
      );
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
  }

  render() {
    if(this.props.notes.length === 0) {
      return (
        <p>There's nothing to see here yet!</p>
      );
    }

    let notesToBeRendered;
    if(this.props.sortByRecent) {
      notesToBeRendered = [...this.props.notes].sort(compareByRecent);
    }
    else {
      notesToBeRendered = this.props.notes;
    }

    if(this.props.organizeBySolved)
      return this.renderIntoSolved(notesToBeRendered);
    else if(this.props.organizeByPlatform)
      return this.renderIntoPlatforms(notesToBeRendered);
    else if(this.props.organizeByContest)
      return this.renderIntoContests(notesToBeRendered);
    else
      return this.renderIntoNotes(notesToBeRendered);
  }
}

export default UserNotesList;
