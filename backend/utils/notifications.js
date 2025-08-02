// backend/utils/notifications.js
const nodemailer = require('nodemailer');

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendIssueStatusUpdate = async (userEmail, issueTitle, newStatus) => {
  try {
    const statusMessages = {
      'in_progress': 'is now being addressed',
      'resolved': 'has been resolved'
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@civictrack.com',
      to: userEmail,
      subject: `Issue Update: ${issueTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CivicTrack - Issue Status Update</h2>
          <p>Hello,</p>
          <p>Your reported issue "<strong>${issueTitle}</strong>" ${statusMessages[newStatus] || 'has been updated'}.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>New Status:</strong> ${newStatus.replace('_', ' ').toUpperCase()}</p>
          </div>
          <p>Thank you for helping to improve our community!</p>
          <p>Best regards,<br>The CivicTrack Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
};

const sendWelcomeEmail = async (userEmail, firstName) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@civictrack.com',
      to: userEmail,
      subject: 'Welcome to CivicTrack!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to CivicTrack, ${firstName}!</h2>
          <p>Thank you for joining our community-driven platform to improve local infrastructure and services.</p>
          <h3>Getting Started:</h3>
          <ul>
            <li>Report issues in your neighborhood</li>
            <li>Track the progress of reported problems</li>
            <li>Help build a better community together</li>
          </ul>
          <p>Visit our platform to start making a difference today!</p>
          <p>Best regards,<br>The CivicTrack Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

module.exports = {
  sendIssueStatusUpdate,
  sendWelcomeEmail
};