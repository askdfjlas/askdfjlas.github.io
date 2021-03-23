import CommentsApi from '../Api/CommentsApi';
import CreateCommentComponent from '../HOC/CreateCommentComponent';
import UserAuthApi from '../Api/UserAuthApi';

function getParamsFromProps(props) {
  const noteAuthor = props.match.params.ownerUsername;
  const platform = props.match.params.platform;
  const contestId = props.match.params.contestId;
  const problemCode = props.match.params.problemCode;
  const problemId = `${contestId}#${problemCode}`;

  return [ noteAuthor, platform, problemId ];
}

async function getNoteComments(props, params) {
  const [ noteAuthor, platform, problemId ] = getParamsFromProps(props);
  const comments = await CommentsApi.getNoteComments(
    noteAuthor, platform, problemId
  );

  const loggedInUsername = await UserAuthApi.getUsername();

  return {
    comments: comments,
    loggedInUsername: loggedInUsername
  };
}

async function addNoteComment(props, newCommentContent, rootReplyId, replyId) {
  const username = await UserAuthApi.getUsername();
  const [ noteAuthor, platform, problemId ] = getParamsFromProps(props);

  return await CommentsApi.addNoteComment(
    username, noteAuthor, platform, problemId, rootReplyId, replyId, newCommentContent
  );
}

export default CreateCommentComponent(getNoteComments, addNoteComment);
