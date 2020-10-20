import Api from './Api';

class NotesApi {
  static async addNote(username, platform, problemSortKey) {
    const options = {
      username: username,
      platform: platform,
      problemId: problemSortKey
    };

    return await Api.postJson('notes', options);
  }
}

export default NotesApi;
