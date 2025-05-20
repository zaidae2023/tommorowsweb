require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./passport');

const vehicleRoutes = require('./routes/vehicleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (req, res) => {
  console.log("✅ Root route accessed");
  res.send('🚗 Welcome to the TuneUp API backend!');
});


// Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
      console.log(`🌐 Visit: http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
