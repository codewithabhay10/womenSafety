const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get route between two points
router.get('/route', async (req, res) => {
  try {
    const { start_lat, start_lng, end_lat, end_lng, profile = 'foot' } = req.query;
    
    if (!start_lat || !start_lng || !end_lat || !end_lng) {
      return res.status(400).json({ msg: 'Start and end coordinates are required' });
    }
    /*{
      params: {
        point: [`${start_lat},${start_lng}`, `${end_lat},${end_lng}`],
        profile: profile, // foot, car, bike, etc.
        instructions: true,
        calc_points: true,
        key: process.env.GRAPHHOPPER_API_KEY
      }
    }*/
    // Call GraphHopper API
    // Change the GraphHopper API call to include instructions:
  const response = await axios.get(`https://graphhopper.com/api/1/route?point=${start_lat},${start_lng}&point=${end_lat},${end_lng}&profile=${profile}&instructions=true&key=${process.env.GRAPHHOPPER_API_KEY}`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Route API error:', error.response?.data || error.message);
    res.status(500).json({ 
      msg: 'Failed to get route information',
      error: error.response?.data || error.message
    });
  }
});

// Get isochrone (areas reachable within a time limit)
router.get('/isochrone', async (req, res) => {
  try {
    const { lat, lng, time_limit = 600, profile = 'foot' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ msg: 'Coordinates are required' });
    }
    
    // Call GraphHopper API
    const response = await axios.get('https://graphhopper.com/api/1/isochrone', {
      params: {
        point: `${lat},${lng}`,
        time_limit: time_limit, // in seconds
        vehicle: profile,
        buckets: 1,
        key: process.env.GRAPHHOPPER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Isochrone API error:', error.response?.data || error.message);
    res.status(500).json({ 
      msg: 'Failed to get isochrone information',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
