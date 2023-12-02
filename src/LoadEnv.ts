import dotenv from 'dotenv';
import path from 'path';

// Set the env file path dynamically
const envFilePath = path.resolve(`.env`);

// Load environment variables from the .env file
const result = dotenv.config({ path: envFilePath });

if (result.error) {
    // Handle the error in a different way, such as logging a message
    console.error(result.error);
}