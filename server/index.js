import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import Url from './models/Url.js';
import Admin from './models/Admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener')
  .then(() => {
    console.log('Connected to MongoDB');
    createDefaultAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Create default admin user
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123'
      });
      await admin.save();
      console.log('Default admin user created: admin/admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Auth middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// POST /api/shorten - Create shortened URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.json({
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `http://localhost:${PORT}/${url.shortCode}`
      });
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    while (!isUnique) {
      shortCode = nanoid(6);
      const existing = await Url.findOne({ shortCode });
      if (!existing) isUnique = true;
    }

    // Create new URL entry
    url = new Url({
      originalUrl,
      shortCode
    });

    await url.save();

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `http://localhost:${PORT}/${url.shortCode}`
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortcode - Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all URLs (admin only)
app.get('/api/admin/urls', authenticateAdmin, async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    
    res.json({
      urls,
      stats: {
        totalUrls: urls.length,
        totalClicks,
        averageClicks: urls.length > 0 ? (totalClicks / urls.length).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});