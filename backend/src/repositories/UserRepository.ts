import { pool } from '../config/db';
import User from '../models/User';

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
}

export default UserRepository;