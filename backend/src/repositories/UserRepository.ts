import { ParameterizedQuery } from "pg-promise";
import { pool } from "../config/db";
import User from "../models/User";
import { QueryConfig } from "pg";

class UserRepository {
  async save(user: User) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "INSERT INTO users(email, password, nickname) VALUES($1, $2, $3) RETURNING *",
        [user.email, user.password, user.nickname]
      );
      return result.rows[0]; // Return the inserted user
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
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      return result.rows[0]; // Return the user with the given id
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
    userId: number,
    file: Express.Multer.File
  ): Promise<number> {
    const { originalname: name, mimetype: type, buffer: data } = file;

    const query: QueryConfig = {
      text: "INSERT INTO profile_pictures (user_id, name, type, data) VALUES ($1, $2, $3, $4) RETURNING id",
      values: [userId, name, type, data],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  }

  async getProfilePicture(
    userId: number
  ): Promise<{ type: string; data: Buffer } | null> {
    const query: QueryConfig = {
      text: "SELECT type, data FROM profile_pictures WHERE user_id = $1",
      values: [userId],
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

  async deleteProfilePicture(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      const query: QueryConfig = {
        text: "DELETE FROM profile_pictures WHERE user_id = $1",
        values: [userId],
      };
      await client.query(query);
    } finally {
      client.release();
    }
  }
}

export default UserRepository;
