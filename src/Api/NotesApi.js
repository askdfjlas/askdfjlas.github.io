import Api from './Api';
import ProblemsApi from './ProblemsApi';

const LIKED_NOTES_PAGE_SIZE = 50;
const RECENT_NOTES_SIDE_EXPIRATION = 2 * 60 * 1000;
let lastRecentNotesSideUpdate = null;
let oldRecentNotesSide = null;

class NotesApi {
  static getNoteEditLink(note) {
    const problemUrl = note.problemSk.replace('#', '/');
    return `/notes/edit/${note.platform}/${problemUrl}`;
  }

  static getNotePublishedLink(note) {
    const problemUrl = note.problemSk.replace('#', '/');
    return `/notes/${note.username}/${note.platform}/${problemUrl}`;
  }

  static getNoteDisplayName(note) {
    const contestDisplayName = ProblemsApi.getContestDisplayName(note);
    const problemDisplayName = ProblemsApi.getProblemDisplayNameWithoutPlatform(note);
    return `${contestDisplayName} ${problemDisplayName}`;
  }

  static async getNotes(username) {
    const options = {
      username: username
    };

    return await Api.getJson('notes', options);
  }

  static async getMostLikedNotes(username, platform, contestId, problemId, page) {
    if(username) {
      let noteInfo = await NotesApi.getNotes(username);
      noteInfo.notes.sort((note1, note2) => note2.likeCount - note1.likeCount);

      let publishedNotes = [];
      for(const note of noteInfo.notes) {
        if(!note.published) continue;
        if(platform && note.platform !== platform) continue;
        if(contestId && note.contestCode !== contestId) continue;
        if(problemId && note.problemSk !== problemId) continue;
        publishedNotes.push(note);
      }

      const totalPages = Math.ceil(publishedNotes.length/LIKED_NOTES_PAGE_SIZE);
      if(page > Math.max(totalPages, 1)) {
        let err = Error();
        err.name = 'PageNotFound';
        throw err;
      }

      let visibleNotes = [];
      const startIndex = (page - 1) * LIKED_NOTES_PAGE_SIZE;
      const endIndex = Math.min(startIndex + LIKED_NOTES_PAGE_SIZE, publishedNotes.length);
      for(let i = startIndex; i < endIndex; i++) {
        visibleNotes.push(publishedNotes[i]);
      }

      return {
        notes: visibleNotes,
        userRanks: noteInfo.userRanks,
        totalPages: Math.max(totalPages, 1)
      };
    }
    else {
      const options = {
        username: username,
        platform: platform,
        contestId: contestId,
        problemId: problemId,
        page: page
      };

      return await Api.getJson('notes', options);
    }
  }

  static async getMostRecentNotes(page) {
    if(page === 1 && Date.now() - lastRecentNotesSideUpdate < RECENT_NOTES_SIDE_EXPIRATION) {
      return oldRecentNotesSide;
    }

    const options = {
      page: page,
      recent: true
    };

    const mostRecentNotes = await Api.getJson('notes', options);
    if(page === 1) {
      oldRecentNotesSide = mostRecentNotes;
      lastRecentNotesSideUpdate = Date.now();
    }

    return mostRecentNotes;
  }

  static async getNoteInfo(username, platform, problemId, forcePublished) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId,
      forcePublished: forcePublished
    };

    let noteInfo = await Api.getJson('notes', options);

    noteInfo.problemInfo.platform = platform;
    noteInfo.problemInfo.problemId = problemId;

    return noteInfo;
  }

  static async addNote(username, platform, problemId) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId
    };

    return await Api.postJson('notes', options);
  }

  static async editNote(username, platform, problemId, title, solved,
                        content, published) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId,
      title: title,
      solved: solved,
      content: JSON.stringify(content),
      published: published
    };

    return await Api.putJson('notes', options);
  }

  static async deleteNote(username, platform, problemId) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId
    };

    return await Api.deleteJson('notes', options);
  }
}

export default NotesApi;
