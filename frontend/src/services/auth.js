import api from './api'

export const register = async (userData) => {
  const response = await api.post('/users/register', userData)
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password })
  return response.data
}

export const getProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export const updateProfile = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData)
  return response.data
}

export const updateEmergencyContacts = async (userId, contacts) => {
  const response = await api.put(`/users/${userId}/emergency-contacts`, { emergencyContacts: contacts })
  return response.data
}

export const sendSOS = async (userId, location) => {
  const response = await api.post(`/users/${userId}/sos`, { location })
  return response.data
}
