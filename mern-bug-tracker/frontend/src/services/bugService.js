import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bugs';

const bugService = {
  getAllBugs: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getBugById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createBug: async (bugData) => {
    try {
      const response = await axios.post(API_URL, bugData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateBug: async (id, bugData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bugData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteBug: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bugService;