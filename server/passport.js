// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      fullName: profile.displayName,
      email,
      avatar: profile.photos[0].value,
      isGoogleUser: true,
    });
  }
  return done(null, user);
}));
