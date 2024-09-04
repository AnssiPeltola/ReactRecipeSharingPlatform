import { ParameterizedQuery } from "pg-promise";
import { pool } from "../config/db";
import User from "../models/User";
import { QueryConfig } from "pg";

class UserRepository {
  async save(user: User) {
    const client = await pool.connect();
    try {
      // Check for email uniqueness
      const emailCheck = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [user.email]
      );
      if (emailCheck.rows.length > 0) {
        throw new Error("Email already in use");
      }

      // Check for nickname uniqueness
      const nicknameCheck = await client.query(
        "SELECT * FROM users WHERE nickname = $1",
        [user.nickname]
      );
      if (nicknameCheck.rows.length > 0) {
        throw new Error("Nickname already in use");
      }

      // Insert the new user
      const result = await client.query(
        "INSERT INTO users(email, password, nickname) VALUES($1, $2, $3) RETURNING *",
        [user.email, user.password, user.nickname]
      );
      return result.rows[0]; // Return the inserted user
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0]; // Return the user with the given email
    } finally {
      client.release();
    }
  }

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          users.*, 
          profile_pictures.id AS profile_picture_id, 
          profile_pictures.type AS profile_picture_type, 
          profile_pictures.data AS profile_picture_data 
        FROM users 
        LEFT JOIN profile_pictures ON users.id = profile_pictures.user_id 
        WHERE users.id = $1
      `,
        [id]
      );
      return result.rows[0]; // Return the user with the given id and profile picture info
    } finally {
      client.release();
    }
  }

  async updateUserDetails(id: number, userDetails: Partial<User>) {
    const client = await pool.connect();
    try {
      const query: QueryConfig<any[]> = {
        text: "UPDATE users SET bio = $1, location = $2, instagram = $3, tiktok = $4, experience_level = $5 WHERE id = $6",
        values: [
          userDetails.bio,
          userDetails.location,
          userDetails.instagram,
          userDetails.tiktok,
          userDetails.experience_level,
          id,
        ],
      };
      await client.query(query);
    } finally {
      client.release();
    }
  }

  async findUserByNickname(nickname: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE nickname = $1",
        [nickname]
      );
      return result && result.rowCount && result.rowCount > 0
        ? result.rows[0]
        : null;
    } finally {
      client.release();
    }
  }

  async uploadProfilePicture(
    user_id: number,
    file: Express.Multer.File
  ): Promise<number> {
    const { originalname: name, mimetype: type, buffer: data } = file;

    const query: QueryConfig = {
      text: "INSERT INTO profile_pictures (user_id, name, type, data) VALUES ($1, $2, $3, $4) RETURNING id",
      values: [user_id, name, type, data],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  }

  async getProfilePicture(
    user_id: number
  ): Promise<{ type: string; data: Buffer } | null> {
    const query: QueryConfig = {
      text: "SELECT type, data FROM profile_pictures WHERE user_id = $1",
      values: [user_id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return {
      type: result.rows[0].type,
      data: result.rows[0].data,
    };
  }

  async deleteProfilePicture(user_id: number): Promise<void> {
    const client = await pool.connect();
    try {
      const query: QueryConfig = {
        text: "DELETE FROM profile_pictures WHERE user_id = $1",
        values: [user_id],
      };
      await client.query(query);
    } finally {
      client.release();
    }
  }

  async getProfilePictureById(id: string) {
    const query = {
      text: "SELECT data, type FROM profile_pictures WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }
}

export default UserRepository;
