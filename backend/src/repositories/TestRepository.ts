import { pool } from '../config/db';

// The Repository directly interacts with the database.
export class TestRepository {
    async getTestMessage() {
        const { rows } = await pool.query('SELECT * FROM test_table');
        return rows[0];
    }
}
