require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./passport'); // Passport config

// Routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); // ✅ Added
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Allow JWT header
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Root route
app.get('/', (req, res) => {
  console.log("✅ Root route accessed");
  res.send('🚗 Welcome to the TuneUp API backend!');
});

// API Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/expenses', expenseRoutes); // ✅ New route added
app.use('/api/services', serviceRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
    console.log(`🌐 Visit: http://localhost:${process.env.PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// Optional: Catch unhandled routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});
