import Api from './Api';

class NotesApi {
  static async getNotes(username) {
    const options = {
      username: username
    };

    return await Api.getJson('notes', options);
  }

  static async getNoteInfo(username, platform, problemId) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemId
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
