const nodemailer = require('nodemailer');
const crypto = require('crypto');

class OTPService {
  constructor() {
    // Configure email transporter
    this.emailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate OTP with expiration (5 minutes)
  generateOTPWithExpiry() {
    const code = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    return { code, expiresAt };
  }

  // Send email OTP
  async sendEmailOTP(email, otp, userName = 'User') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@quickcourt.com',
        to: email,
        subject: 'QuickCourt - Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0;">QuickCourt</h1>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h2>
              <p style="color: #6b7280; margin-bottom: 30px;">
                Hi ${userName},<br>
                Use the following verification code to complete your registration:
              </p>
              
              <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 4px;">${otp}</span>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
                This code will expire in 5 minutes.<br>
                If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2025 QuickCourt. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email OTP sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email OTP:', error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS OTP (mock implementation - you can integrate with services like Twilio, MSG91, etc.)
  async sendSMSOTP(phone, otp) {
    try {
      // Mock SMS implementation
      console.log(`SMS OTP sent to ${phone}: ${otp}`);
      
      // For real implementation, integrate with SMS service:
      /*
      const response = await axios.post('SMS_PROVIDER_API', {
        to: phone,
        message: `Your QuickCourt verification code is: ${otp}. Valid for 5 minutes.`,
        apiKey: process.env.SMS_API_KEY
      });
      */
      
      return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify OTP
  verifyOTP(storedOTP, providedOTP, expiresAt) {
    if (!storedOTP || !providedOTP) {
      return { valid: false, reason: 'OTP not provided' };
    }

    if (new Date() > expiresAt) {
      return { valid: false, reason: 'OTP expired' };
    }

    if (storedOTP !== providedOTP) {
      return { valid: false, reason: 'Invalid OTP' };
    }

    return { valid: true, reason: 'OTP verified successfully' };
  }

  // Format phone number (basic validation)
  formatPhoneNumber(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming India +91)
    if (digits.length === 10) {
      return '+91' + digits;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return '+' + digits;
    } else if (digits.length === 13 && digits.startsWith('91')) {
      return digits;
    }
    
    return phone; // Return as-is if format not recognized
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  validatePhoneNumber(phone) {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

module.exports = new OTPService();
