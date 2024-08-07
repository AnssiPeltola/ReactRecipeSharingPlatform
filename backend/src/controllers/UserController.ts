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
    const { email, password, nickname } = req.body;
    const user = await this.userService.register(email, password, nickname);
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
    const {
      firstname,
      lastname,
      bio,
      location,
      instagram,
      tiktok,
      experienceLevel,
    } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "No user is logged in" });
    }
    // Create a Partial<User> object
    const userDetails: Partial<User> = {
      firstname,
      lastname,
      bio,
      location,
      instagram,
      tiktok,
      experience_level: experienceLevel,
    };
    // Update the user's details
    await this.userService.updateUserDetails(req.user.id, userDetails);
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

  async checkNickname(req: Request, res: Response) {
    try {
      const { nickname } = req.query;

      if (typeof nickname !== "string") {
        return res.status(400).json({ error: "Nickname must be a string" });
      }

      const exists = await this.userService.checkNickname(nickname);
      res.json({ exists });
    } catch (error) {
      console.error("Error checking nickname:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default UserController;
