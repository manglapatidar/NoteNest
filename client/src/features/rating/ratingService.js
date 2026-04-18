import axios from 'axios';

const API_URL = '/api/rating/';
const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const rateNote = async (noteId, rating, token) => {

  const response = await axios.post(API_URL, { noteId, score: rating }, getConfig(token));
  return response.data;
};

const ratingService = { rateNote };
export default ratingService;