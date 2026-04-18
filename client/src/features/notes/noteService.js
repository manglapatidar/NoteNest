import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notes/';
const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const getNotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getNoteById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const createNote = async (formData, token) => {
  const response = await axios.post(API_URL, formData, getConfig(token));
  return response.data;
};

const toggleSaveNote = async (id, token) => {
  const response = await axios.put(API_URL + `save/${id}`, {}, getConfig(token));
  return response.data;
};

const deleteNote = async (id, token) => {
  await axios.delete(API_URL + id, getConfig(token));
  return id;
};

const updateNoteFile = async (id, formData, token) => {
  const response = await axios.patch(API_URL + id, formData, getConfig(token));
  return response.data;
};

const noteService = { getNotes, getNoteById, createNote, toggleSaveNote, deleteNote, updateNoteFile };
export default noteService;