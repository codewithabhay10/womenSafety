import api from './api'

export const getAllReviews = async () => {
  const response = await api.get('/reviews')
  return response.data
}

export const getNearbyReviews = async (lat, lng, maxDistance = 5000) => {
  const response = await api.get('/reviews/near', {
    params: { lat, lng, maxDistance }
  })
  return response.data
}

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData)
  return response.data
}

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData)
  return response.data
}

export const likeReview = async (reviewId, userId) => {
  const response = await api.put(`/reviews/like/${reviewId}`, { userId })
  return response.data
}

export const dislikeReview = async (reviewId, userId) => {
  const response = await api.put(`/reviews/dislike/${reviewId}`, { userId })
  return response.data
}

export const deleteReview = async (reviewId, userId) => {
  const response = await api.delete(`/reviews/${reviewId}`, { 
    data: { userId } 
  })
  return response.data
}