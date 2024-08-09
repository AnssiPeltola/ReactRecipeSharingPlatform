import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import User from "../models/User";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(email: string, password: string, nickname: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, nickname });
    return this.userRepository.save(user);
  }

  async updateUserDetails(id: number, userDetails: Partial<User>) {
    return this.userRepository.updateUserDetails(id, userDetails);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("No user found with this email.");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password.");
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async checkNickname(nickname: string) {
    const user = await this.userRepository.findUserByNickname(nickname);
    return user !== null;
  }

  async uploadProfilePicture(
    userId: number,
    file: Express.Multer.File
  ): Promise<number> {
    try {
      const fileId = await this.userRepository.uploadProfilePicture(
        userId,
        file
      );
      return fileId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProfilePicture(
    userId: number
  ): Promise<{ type: string; data: Buffer } | null> {
    try {
      return await this.userRepository.getProfilePicture(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async hasProfilePicture(userId: number): Promise<boolean> {
    const profilePicture = await this.userRepository.getProfilePicture(userId);
    return !!profilePicture;
  }

  async deleteProfilePicture(userId: number): Promise<void> {
    await this.userRepository.deleteProfilePicture(userId);
  }
}

export default UserService;
