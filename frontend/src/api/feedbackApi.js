import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

export const submitFeedback = (data) => api.post('/feedback', data);
export const getAllFeedbacks = (page = 1, limit = 8) =>
    api.get(`/feedbacks?page=${page}&limit=${limit}`);
export const getFeedbacksBySubject = (subject) =>
    api.get(`/feedbacks/${encodeURIComponent(subject)}`);
export const getSubjects = () => api.get('/subjects');
