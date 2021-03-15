import Api from './Api';

class CommentsApi {
  static async getNoteComments(noteAuthor, platform, problemId) {
    const options = {
      noteAuthor: noteAuthor,
      platform: platform,
      problemId: problemId
    };

    return await Api.getJson('comments', options);
  }

  static async addNoteComment(username, noteAuthor, platform, problemId,
                              replyId, content) {
    const options = {
      username: username,
      noteAuthor: noteAuthor,
      platform: platform,
      problemId: problemId,
      replyId: replyId,
      content: content
    };

    return await Api.postJson('comments', options);
  }
}

export default CommentsApi;
