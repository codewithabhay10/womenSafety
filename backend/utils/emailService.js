const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Send SOS email
const sendSOSEmail = async (user, location, emergencyContacts) => {
  try {
    const transporter = createTransporter();
    
    const emailPromises = emergencyContacts.map(contact => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'EMERGENCY SOS ALERT',
        html: `
          <h2>EMERGENCY SOS ALERT</h2>
          <p>${user.name} has triggered an emergency alert!</p>
          <p>Current location: <a href="https://www.google.com/maps?q=${location.lat},${location.lng}">View on Google Maps</a></p>
          <p>Coordinates: ${location.lat}, ${location.lng}</p>
          <p>This person has listed you as an emergency contact (${contact.relation}).</p>
          <p>Please try to contact them immediately or alert local authorities if needed.</p>
        `
      });
    });
    
    await Promise.all(emailPromises);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSOSEmail };
