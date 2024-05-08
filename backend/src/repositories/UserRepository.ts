import { ParameterizedQuery } from 'pg-promise';
import { pool } from '../config/db';
import User from '../models/User';
import { QueryConfig } from 'pg';

class UserRepository {
  async save(user: User) {
    const client = await pool.connect();
    try {
      const result = await client.query('INSERT INTO users(email, password) VALUES($1, $2) RETURNING *', [user.email, user.password]);
      return result.rows[0]; // Return the inserted user
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0]; // Return the user with the given email
    } finally {
      client.release();
    }
  }

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0]; // Return the user with the given id
    } finally {
      client.release();
    }
  }

  async updateUserDetails(id: number, firstname: string, lastname: string) {
    const client = await pool.connect();
    try {
      const query: QueryConfig<any[]> = {
        text: 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3',
        values: [firstname, lastname, id],
      };
      await client.query(query);
    } finally {
      client.release();
    }
  }
}

export default UserRepository;