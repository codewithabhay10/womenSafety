// src/utils/helpers.js

/**
 * Format a date relative to the current time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'yesterday';
    }
    
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
    
    // Format as MM/DD/YYYY for older dates
    return targetDate.toLocaleDateString();
  };
  
  /**
   * Get safety level color class based on safety level
   * @param {string} safetyLevel - The safety level (safe, caution, avoid)
   * @returns {string} Tailwind CSS color class
   */
  export const getSafetyLevelClass = (safetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'caution':
        return 'bg-yellow-100 text-yellow-800';
      case 'avoid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  /**
   * Truncate text to a specified length
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated text with ellipsis if needed
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Generate initials from a name
   * @param {string} name - Full name
   * @returns {string} Initials (up to 2 characters)
   */
  export const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  /**
   * Check if a location is within a specified radius
   * @param {Object} point1 - First location {lat, lng}
   * @param {Object} point2 - Second location {lat, lng}
   * @param {number} radius - Radius in kilometers
   * @returns {boolean} Whether point2 is within radius of point1
   */
  export const isWithinRadius = (point1, point2, radius) => {
    if (!point1 || !point2) return false;
    
    // Earth's radius in kilometers
    const earthRadius = 6371;
    
    const lat1 = parseFloat(point1.lat);
    const lng1 = parseFloat(point1.lng);
    const lat2 = parseFloat(point2.lat);
    const lng2 = parseFloat(point2.lng);
    
    // Convert to radians
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = earthRadius * c;
    
    return distance <= radius;
  };
  
  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  