import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './passport.js'; // ✅ Include .js extension for ESM

// Route Imports
import vehicleRoutes from './routes/vehicleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import stripeWebhook from './routes/stripeWebhook.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://meek-macaron-f162ab.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser());
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Stripe Webhook needs raw body - must be before express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Now apply express.json for all other routes
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  console.log("Root route accessed");
  res.send('🚗 Welcome to the TuneUp API backend!');
});

// Main Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/stripe', stripeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// 404 Catch-All
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});
