import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getShifts = () => axios.get(`${API_URL}/shifts`);
export const getShiftById = (id) => axios.get(`${API_URL}/shifts/${id}`);
export const createShift = (data) => axios.post(`${API_URL}/shifts`, data);
export const updateShift = (id, data) => axios.put(`${API_URL}/shifts/${id}`, data);
export const deleteShift = (id) => axios.delete(`${API_URL}/shifts/${id}`);

export const getOperators = () => axios.get(`${API_URL}/operators`);
export const getOperatorById = (id) => axios.get(`${API_URL}/operators/${id}`);
export const createOperator = (data) => axios.post(`${API_URL}/operators`, data);
export const updateOperator = (id, data) => axios.put(`${API_URL}/operators/${id}`, data);
export const deleteOperator = (id) => axios.delete(`${API_URL}/operators/${id}`);

export const getModels = () => axios.get(`${API_URL}/models`);
export const getModelById = (id) => axios.get(`${API_URL}/models/${id}`);
export const createModel = (data) => axios.post(`${API_URL}/models`, data);
export const updateModel = (id, data) => axios.put(`${API_URL}/models/${id}`, data);
export const deleteModel = (id) => axios.delete(`${API_URL}/models/${id}`);

export const getFanslyRecords = () => axios.get(`${API_URL}/fansly`);
export const getFanslyRecordById = (id) => axios.get(`${API_URL}/fansly/${id}`);
export const createFanslyRecord = (data) => axios.post(`${API_URL}/fansly`, data);
export const updateFanslyRecord = (id, data) => axios.put(`${API_URL}/fansly/${id}`, data);
export const deleteFanslyRecord = (id) => axios.delete(`${API_URL}/fansly/${id}`);
