import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userService.register(email, password);
    res.json({ message: 'User registered successfully', user });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  checkAuthentication(req: Request, res: Response) {
    if (req.user) {
      res.send({ loggedIn: true, user: req.user });
    } else {
      res.send({ loggedIn: false });
    }
  }
}

export default UserController;