import axios from 'axios';

const API_URL = '/api/comments/';
const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const getComments = async (noteId) => {
  const response = await axios.get(API_URL + noteId);
  return response.data;
};

const postComment = async (noteId, text, token) => {
 
  const response = await axios.post(API_URL, { noteId, text }, getConfig(token));
  return response.data;
};

const deleteComment = async (commentId, token) => {
  await axios.delete(API_URL + commentId, getConfig(token));
  return commentId;
};

const commentService = { getComments, postComment, deleteComment };
export default commentService;