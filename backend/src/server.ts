import app from './app';
import { config } from 'dotenv';

config(); // Load environment variables

const port = process.env.PORT || 3000; // Use port from environment variables or default to 3000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
