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
                              rootReplyId, replyId, content) {
    const options = {
      username: username,
      noteAuthor: noteAuthor,
      platform: platform,
      problemId: problemId,
      rootReplyId: rootReplyId,
      replyId: replyId,
      content: JSON.stringify(content)
    };

    return await Api.postJson('comments', options);
  }

  static async editComment(commentId, content) {
    const options = {
      commentId: commentId,
      content: JSON.stringify(content)
    };

    return await Api.putJson('comments', options);
  }

  static async deleteComment(commentId) {
    const options = {
      commentId: commentId
    };

    return await Api.deleteJson('comments', options);
  }
}

export default CommentsApi;
