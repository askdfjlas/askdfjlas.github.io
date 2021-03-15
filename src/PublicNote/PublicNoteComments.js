import CommentsApi from '../Api/CommentsApi';
import CreateCommentComponent from '../HOC/CreateCommentComponent';

async function getNoteComments(props, params) {
  const noteAuthor = props.match.params.ownerUsername;
  const platform = props.match.params.platform;
  const contestId = props.match.params.contestId;
  const problemCode = props.match.params.problemCode;
  const problemId = `${contestId}#${problemCode}`;

  const comments = await CommentsApi.getNoteComments(
    noteAuthor, platform, problemId
  );

  return {
    comments: comments
  };
}

const addNoteComment = null;

export default CreateCommentComponent(getNoteComments, addNoteComment);
