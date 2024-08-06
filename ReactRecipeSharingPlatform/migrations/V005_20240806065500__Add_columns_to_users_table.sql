-- Step 1: Add the columns as nullable
ALTER TABLE users 
ADD COLUMN nickname VARCHAR(255) UNIQUE,
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(255),
ADD COLUMN instagram VARCHAR(255),
ADD COLUMN tiktok VARCHAR(255),
ADD COLUMN experience_level VARCHAR(255);

-- Step 2: Update existing rows with a default or unique value for nickname
UPDATE users SET nickname = CONCAT('user_', id) WHERE nickname IS NULL;

-- Step 3: Alter the nickname column to be NOT NULL
ALTER TABLE users 
ALTER COLUMN nickname SET NOT NULL;