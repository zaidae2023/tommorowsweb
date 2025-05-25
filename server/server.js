require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./passport'); // Passport config

// Route Imports
const vehicleRoutes = require('./routes/vehicleRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const profileRoutes = require('./routes/profileRoutes'); // ✅ Added

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ✅ Serve uploaded avatars
app.use('/uploads', express.static('uploads'));

// ✅ Root Route
app.get('/', (req, res) => {
  console.log("✅ Root route accessed");
  res.send('🚗 Welcome to the TuneUp API backend!');
});

// ✅ API Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/profile', profileRoutes); // ✅ Profile routes added

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// ✅ Catch-All Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});
