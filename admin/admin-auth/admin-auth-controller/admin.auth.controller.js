import Admin from '../admin-auth-model/admin.auth.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
  secure: false, // Set to true if using a secure connection (TLS)
  port: 587, // Common port for SMTP
});

const adminController = {
 
  signup: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);


      const newAdmin = new Admin({
        email,
        password: hashedPassword,
      });

      await newAdmin.save();

      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Error during signup', error: error.message });
    }
  },

  
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  },

  // Forgot Password
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Generate OTP and expiry time
      const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
      const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

      // Update OTP and expiry time for the admin
      admin.otp = otp;
      admin.otpExpires = otpExpires;
      await admin.save();

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending OTP email:', error);
          return res.status(500).json({ message: 'Error sending OTP', error: error.message });
        } else {
          console.log('OTP email sent:', info);
          res.status(200).json({ message: 'OTP sent successfully' });
        }
      });
    } catch (error) {
      console.error('Error during forgot password:', error);
      res.status(500).json({ message: 'Error during forgot password', error: error.message });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required' });
      }

      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Check if the OTP is valid and not expired
      if (admin.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (admin.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear OTP
      admin.password = hashedPassword;
      admin.otp = null;
      admin.otpExpires = null;
      await admin.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  },
};

export default adminController;
