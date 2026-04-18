import axios from 'axios';

const API_URL = '/api/admin/';
const NOTES_URL = '/api/notes/';

const getStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

const getNotes = async (token, status = '') => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const url = status ? `${API_URL}notes?status=${status}` : `${API_URL}notes`;
  const response = await axios.get(url, config);
  return response.data;
};

const getPendingNotes = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(NOTES_URL + 'pending', config);
  return response.data;
};

const getAllNotes = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const [approvedRes, pendingRes] = await Promise.all([
    axios.get(NOTES_URL, config),
    axios.get(NOTES_URL + 'pending', config),
  ]);
  const approved = (approvedRes.data || []).map((n) => ({ ...n, status: 'Approved' }));
  const pending  = (pendingRes.data  || []).map((n) => ({ ...n, status: 'Pending'  }));
  return [...pending, ...approved];
};

const approveNote = async (noteId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(NOTES_URL + `${noteId}/approve`, {}, config);
  return response.data;
};

const rejectNote = async (noteId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(NOTES_URL + `${noteId}/reject`, {}, config);
  return response.data;
};

const deleteNote = async (noteId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + `notes/${noteId}`, config);
  return response.data;
};

const adminService = { getStats, getNotes, getPendingNotes, getAllNotes, approveNote, rejectNote, deleteNote };
export default adminService;