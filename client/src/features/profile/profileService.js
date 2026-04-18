import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// User ke apne uploaded notes
const getMyNotes = async (token) => {
  const response = await axios.get(`${API_URL}/notes/my-notes`, getConfig(token));
  return response.data;
};

// User ke saved notes
const getSavedNotes = async (token) => {
  const response = await axios.get(`${API_URL}/notes/saved`, getConfig(token));
  return response.data;
};

const profileService = { getMyNotes, getSavedNotes };
export default profileService;