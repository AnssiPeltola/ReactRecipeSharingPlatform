import express, { Express } from 'express';
import cors from 'cors';
import { TestController } from './controllers/TestController';
import UserController from './controllers/UserController';
import UserService from './services/UserService';
import UserRepository from './repositories/UserRepository';

const app: Express = express();
const testController = new TestController(); // Instantiate your controller
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use(cors());
app.use(express.json());

// Use the controller to handle the route
app.get('/test', testController.getTestMessage);

app.post('/register', (req, res) => userController.register(req, res));
app.post('/login', (req, res) => userController.login(req, res));

export default app;