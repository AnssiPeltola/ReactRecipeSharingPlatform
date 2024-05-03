import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import passport from './middleware/passportConfig';
import { TestController } from './controllers/TestController';
import UserController from './controllers/UserController';
import UserService from './services/UserService';
import UserRepository from './repositories/UserRepository';

const app: Express = express();
const testController = new TestController();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Use the controller to handle the route
app.get('/test', testController.getTestMessage);

app.post('/register', (req, res) => userController.register(req, res));
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err: any) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
});

export default app;