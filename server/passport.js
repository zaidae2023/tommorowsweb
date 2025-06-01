// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
require('dotenv').config(); // Load environment variables

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // Check if user exists
      let user = await User.findOne({ email });

      // If user doesn't exist, create one
      if (!user) {
        user = await User.create({
          fullName: profile.displayName,
          email,
          avatar: profile.photos[0].value,
          isGoogleUser: true,
          isVerified: true, // Optionally auto-verify Google users
        });
      }

      return done(null, user);
    } catch (err) {
      console.error('❌ Google OAuth error:', err);
      return done(err, null);
    }
  }
));

//Serialize and deserialize user (if needed for sessions)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
