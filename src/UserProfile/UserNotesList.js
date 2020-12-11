import React, { Component } from 'react';
import UserNoteInfo from './UserNoteInfo';
import UserContestInfo from './UserContestInfo';
import UserNotesTitleDropdown from './UserNotesTitleDropdown';
import VirtualPaginator from '../Paginator/VirtualPaginator';
import Paginator from '../Paginator/Paginator';
import ProblemsApi from '../Api/ProblemsApi';
import UserAuthApi from '../Api/UserAuthApi';
import Utils from '../Utils';

const RecursionLevel = Object.freeze({
  CONTEST: 0,
  PLATFORM: 1,
  SOLVED: 2
});
const PAGINATE_SIZE = 15;

function compareByRecent(note1, note2) {
  if(note1.editedTime > note2.editedTime)
    return -1;
  return 1;
}

function groupByAttributes(objectList, attributes) {
  let attributeGroups = {};
  for(const obj of objectList) {
    let attributeValues = [];
    for(const attribute of attributes) {
      attributeValues.push(obj[attribute]);
    }

    const key = attributeValues.join('#');
    if(attributeGroups.hasOwnProperty(key)) {
      attributeGroups[key].push(obj);
    }
    else {
      attributeGroups[key] = [ obj ];
    }
  }

  return attributeGroups;
}

class UserNotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      loggedInUsername: null
    };

    this.sortNoteItems(this.props.notes);
    this.virtualPaginator = new VirtualPaginator(PAGINATE_SIZE, this.sortedNoteItems);

    this.updatePage = this.updatePage.bind(this);
  }

  async componentDidMount() {
    const loggedInUsername = await UserAuthApi.getUsername();
    await Utils.setStatePromise(this, {
      loggedInUsername: loggedInUsername
    });
  }

  createContestObject(notes) {
    const firstNote = notes[0];
    let contestObject = {
      contestCode: firstNote.contestCode,
      contestName: firstNote.contestName,
      platform: firstNote.platform,
      editedTime: firstNote.editedTime,
      notes: []
    };

    if(this.props.organizeBySolved)
      contestObject.solved = firstNote.solved;
    if(this.props.organizeByPlatform)
      contestObject.platform = firstNote.platform;

    for(const note of notes) {
      contestObject.notes.push(note);
      if(note.editedTime > contestObject.editedTime) {
        contestObject.editedTime = note.editedTime;
      }
    }

    return contestObject;
  }

  sortNoteItems(notes, recursionLevel = RecursionLevel.SOLVED, keyString = '') {
    let paginatorIndices = [];
    if(recursionLevel === RecursionLevel.CONTEST) {
      if(this.props.organizeByContest) {
        const contestGroups = groupByAttributes(notes, ['platform', 'contestCode']);
        for(const key in contestGroups) {
          let contestObject = this.createContestObject(contestGroups[key]);
          paginatorIndices.push(this.sortedNoteItems.length);
          this.sortedNoteItems.push(contestObject);
        }
      }
      else {
        for(const note of notes) {
          paginatorIndices.push(this.sortedNoteItems.length);
          this.sortedNoteItems.push(note);
        }
      }
    }
    else {
      let organize, attributeString;
      if(recursionLevel === RecursionLevel.SOLVED) {
        this.sortedNoteItems = [];
        this.dropdownShowing = {};
        this.dropdownIndices = {};

        if(this.props.sortByRecent) {
          notes = [...notes].sort(compareByRecent);
        }

        organize = this.props.organizeBySolved;
        attributeString = 'solved';
      }
      else {
        organize = this.props.organizeByPlatform;
        attributeString = 'platform';
      }

      if(organize) {
        const groups = groupByAttributes(notes, [attributeString]);
        for(const key in groups) {
          const innerKeyString = `${keyString}#${key}`;
          const innerIndices =
            this.sortNoteItems(groups[key], recursionLevel - 1, innerKeyString);

          this.dropdownShowing[innerKeyString] = true;
          this.dropdownIndices[innerKeyString] = innerIndices;

          for(const index of innerIndices) {
            paginatorIndices.push(index);
          }
        }
      }
      else {
        return this.sortNoteItems(notes, recursionLevel - 1, keyString);
      }
    }

    return paginatorIndices;
  }

  renderNoteItems(notes, recursionLevel = RecursionLevel.SOLVED, keyString = '') {
    let noteInfoElements = [];
    if(recursionLevel === RecursionLevel.CONTEST) {
      let NoteComponent =
        this.props.organizeByContest ? UserContestInfo : UserNoteInfo;

      for(let i = 0; i < notes.length; i++) {
        noteInfoElements.push(
          <NoteComponent key={i} info={notes[i]}
                         loggedInUsername={this.state.loggedInUsername} />
        );
      }
    }
    else {
      let organize, attributeString;
      if(recursionLevel === RecursionLevel.SOLVED) {
        organize = this.props.organizeBySolved;
        attributeString = 'solved';
      }
      else {
        organize = this.props.organizeByPlatform;
        attributeString = 'platform';
      }

      if(organize) {
        const groups = groupByAttributes(notes, [attributeString]);
        for(const key in groups) {
          const innerKeyString = `${keyString}#${key}`;
          const innerContent =
            this.renderNoteItems(groups[key], recursionLevel - 1, innerKeyString);
          const title = (recursionLevel === RecursionLevel.SOLVED) ?
            ProblemsApi.getSolvedStateText(key) : key;

          const showing = this.dropdownShowing[innerKeyString];
          const innerIndices = this.dropdownIndices[innerKeyString];
          const toggleCallback = async () => {
            this.virtualPaginator.toggleActiveItems(innerIndices);
            this.dropdownShowing[innerKeyString] = !this.dropdownShowing[innerKeyString];

            const totalPages = this.virtualPaginator.getPageCount();
            if(this.state.page > totalPages) {
              await this.updatePage(totalPages);
            }

            this.forceUpdate();
          };

          noteInfoElements.push(
            <UserNotesTitleDropdown key={key} title={title}
                                    innerContent={innerContent} showing={showing}
                                    toggleCallback={toggleCallback} />
          );
        }
      }
      else {
        return this.renderNoteItems(notes, recursionLevel - 1);
      }
    }

    return (
      <ul className="User-notes-list">
        { noteInfoElements }
      </ul>
    );
  }

  async updatePage(page) {
    await Utils.setStatePromise(this, {
      page: page
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only re-sort note items on an (important) props update
    const importantProps = [
      'organizeBySolved',
      'organizeByPlatform',
      'organizeByContest',
      'sortByRecent'
    ];
    const currentImportantProps = importantProps.map((x) => this.props[x]);
    const nextImportantProps = importantProps.map((x) => nextProps[x]);

    if(JSON.stringify(currentImportantProps) !== JSON.stringify(nextImportantProps)) {
      this.props = nextProps;
      this.sortNoteItems(this.props.notes);
      this.virtualPaginator.setContent(this.sortedNoteItems);

      if(this.state.page !== 1) {
        this.updatePage(1);
        return false;
      }
    }

    return true;
  }

  render() {
    if(this.props.notes.length === 0) {
      return (
        <p className="User-notes-nothing">There's nothing to see here yet!</p>
      );
    }

    const noteItems = this.virtualPaginator.getContent(this.state.page);
    const totalPages = this.virtualPaginator.getPageCount();
    const paginator = (
      <Paginator currentPage={this.state.page} totalPages={totalPages}
                 callback={this.updatePage} />
    );

    return (
      <>
        { paginator }
        { this.renderNoteItems(noteItems) }
        { paginator }
      </>
    );
  }
}

export default UserNotesList;
