import { Request, Response } from "express";
import UserService from "../services/UserService";
import User from "../models/User";
import jwt from "jsonwebtoken";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userService.register(email, password);
    // Log the user in
    req.user = user;
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    res.json({ message: "User registered and logged in successfully", token });
  }

  getLoggedInUserEmail(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "No user is logged in" });
    }
    const user = req.user as User;
    return res.json({ email: user.email });
  }

  async registerDetails(req: Request & { user?: User }, res: Response) {
    console.log(req.headers.authorization);
    const { firstname, lastname } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "No user is logged in" });
    }
    // Update the user's firstname and lastname
    await this.userService.updateUserDetails(req.user.id, firstname, lastname);
    return res.json({ message: "Registration complete" });
  }

  // async login(req: Request, res: Response) {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await this.userService.login(email, password);
  //     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-jwt-secret');
  //     res.json({ user, token });
  //   } catch (error: any) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }

  checkAuthentication(req: Request, res: Response) {
    if (req.user) {
      const user: User = req.user as User;
      res.send({ loggedIn: true, user: { id: user.id, email: user.email } });
    } else {
      res.send({ loggedIn: false });
    }
  }
}

export default UserController;
