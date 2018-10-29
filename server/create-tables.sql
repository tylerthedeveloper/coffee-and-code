CREATE TABLE IF NOT EXISTS USERS (
    user_id serial PRIMARY KEY,
    git_username VARCHAR (50) UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    bio TEXT,
    
);