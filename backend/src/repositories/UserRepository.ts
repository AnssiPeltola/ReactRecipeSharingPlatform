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
        text: "UPDATE users SET firstname = $1, lastname = $2, bio = $3, location = $4, instagram = $5, tiktok = $6, experience_level = $7 WHERE id = $8",
        values: [
          userDetails.firstname,
          userDetails.lastname,
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
}

export default UserRepository;
