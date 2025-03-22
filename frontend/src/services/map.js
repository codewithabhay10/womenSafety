import api from './api'

export const getRoute = async (startLat, startLng, endLat, endLng, profile = 'foot') => {
  const response = await api.get('/maps/route', {
    params: {
      start_lat: startLat,
      start_lng: startLng,
      end_lat: endLat,
      end_lng: endLng,
      profile
    }
  })
  return response.data
}

export const getIsochrone = async (lat, lng, timeLimit = 600, profile = 'foot') => {
  const response = await api.get('/maps/isochrone', {
    params: {
      lat,
      lng,
      time_limit: timeLimit,
      profile
    }
  })
  return response.data
}