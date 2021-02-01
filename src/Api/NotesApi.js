import Api from './Api';

const LIKED_NOTES_PAGE_SIZE = 50;

class NotesApi {
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

      let visibleNotes = [];
      const startIndex = (page - 1) * LIKED_NOTES_PAGE_SIZE;
      const endIndex = Math.min(startIndex + LIKED_NOTES_PAGE_SIZE, notes.length);
      for(let i = startIndex; i < endIndex; i++) {
        visibleNotes.push(notes[i]);
      }

      return {
        notes: visibleNotes,
        totalPages: Math.ceil(notes.length/LIKED_NOTES_PAGE_SIZE)
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
