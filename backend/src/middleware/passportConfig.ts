import bcrypt from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';
import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';
import User from '../models/User';
import passportJwt from 'passport-jwt';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // Try to find a user with the provided email
  const user = await userService.findByEmail(email);

  if (!user) {
    return done(null, false, { message: 'No user with that email' });
  }

  try {
    // If a user is found, compare the provided password with the stored password
    if (await bcrypt.compare(password, user.password)) {
      // If the passwords match, call the done function with the user object
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password incorrect' });
    }
  } catch (e) {
    return done(e);
  }
}));

// Define how Passport.js should serialize a user object into a session ID
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

// Define how Passport.js should deserialize a session ID into a user object
passport.deserializeUser((id: string, done) => {
  userService.findById(Number(id))
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret'
}, async (jwtPayload: any, done: any) => {
  try {
    const user = await userService.findById(jwtPayload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;