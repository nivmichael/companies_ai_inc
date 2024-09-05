// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

export default {
  login(username, password) {
    console.log('Attempting login with:', { username, password }); // For debugging
    return axios
      .post(API_URL + 'login', {
        username,
        password
      })
      .then(response => {
        console.log('Login response:', response.data); // For debugging
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch(error => {
        console.error('Login error:', error.response ? error.response.data : error.message); // For debugging
        throw error;
      });
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};