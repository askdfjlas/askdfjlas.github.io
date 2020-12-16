import Api from './Api';

class LikesApi {
  static async sendLike(username, noteAuthor, platform, problemId, likedStatus) {
    const options = {
      username: username,
      noteAuthor: noteAuthor,
      platform: platform,
      problemId: problemId,
      likedStatus: likedStatus
    };

    return await Api.putJson('likes/notes', options);
  }
}

export default LikesApi;
