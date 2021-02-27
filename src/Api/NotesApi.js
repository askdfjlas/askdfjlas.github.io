import Api from './Api';
import ProblemsApi from './ProblemsApi';

const LIKED_NOTES_PAGE_SIZE = 50;

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
      let notes = await NotesApi.getNotes(username);
      notes.sort((note1, note2) => note2.likeCount - note1.likeCount);

      let publishedNotes = [];
      for(const note of notes) {
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
    const options = {
      page: page,
      recent: true
    };

    return await Api.getJson('notes', options);
  }

  static async getNoteInfo(username, platform, problemId, forcePublished) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId,
      forcePublished: forcePublished
    };

    return await Api.getJson('notes', options);
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
      content: content,
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
