const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get reviews near a location
router.get('/near', async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters
    
    if (!lng || !lat) {
      return res.status(400).json({ msg: 'Location coordinates required' });
    }
    
    const reviews = await Review.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).populate('userId', 'name');
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a review
router.post('/', async (req, res) => {
  try {
    const { userId, routeName, content, rating, location } = req.body;
    
    if (!userId || !routeName || !content || !rating || !location) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    const newReview = new Review({
      userId,
      routeName,
      content,
      rating,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    });
    
    const review = await newReview.save();
    await review.populate('userId', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { userId, routeName, content, rating } = req.body;
    
    // Check if review exists
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    
    // Check user ownership
    if (review.userId.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to update this review' });
    }
    
    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.id,
      { routeName, content, rating },
      { new: true }
    ).populate('userId', 'name');
    
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if review exists
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    
    // Check user ownership
    if (review.userId.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to delete this review' });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Review removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Like a review
router.put('/like/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    
    // Check if already liked
    if (review.likedBy.includes(userId)) {
      // Remove like if already liked
      review.likes--;
      review.likedBy = review.likedBy.filter(
        id => id.toString() !== userId
      );
    } else {
      // Add like
      review.likes++;
      review.likedBy.push(userId);
      
      // Remove dislike if exists
      if (review.dislikedBy.includes(userId)) {
        review.dislikes--;
        review.dislikedBy = review.dislikedBy.filter(
          id => id.toString() !== userId
        );
      }
    }
    
    await review.save();
    
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Dislike a review
router.put('/dislike/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    
    // Check if already disliked
    if (review.dislikedBy.includes(userId)) {
      // Remove dislike if already disliked
      review.dislikes--;
      review.dislikedBy = review.dislikedBy.filter(
        id => id.toString() !== userId
      );
    } else {
      // Add dislike
      review.dislikes++;
      review.dislikedBy.push(userId);
      
      // Remove like if exists
      if (review.likedBy.includes(userId)) {
        review.likes--;
        review.likedBy = review.likedBy.filter(
          id => id.toString() !== userId
        );
      }
    }
    
    await review.save();
    
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
