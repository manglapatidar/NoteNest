// src/features/auth/authService.js

import axios from "axios";

const API_URL = "/api/auth";

// REGISTER
const register = async (formData) => {
  const response = await axios.post(API_URL + "/register", formData);

  localStorage.setItem("user", JSON.stringify(response.data));
  console.log(response.data);

  return response.data;
};

// LOGIN
const login = async (formData) => {
  const response = await axios.post(API_URL + "/login", formData);

  localStorage.setItem("user", JSON.stringify(response.data));
  console.log(response.data);

  return response.data;
};

const authService = { register, login };

export default authService;


