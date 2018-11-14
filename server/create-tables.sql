CREATE TABLE IF NOT EXISTS USERS (
    userID serial PRIMARY KEY,
    git_username VARCHAR (50) UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    bio TEXT,
    picture_url VARCHAR,
    current_latitude FLOAT,
    current_longitude FLOAT,
    current_location GEOGRAPHY
);

CREATE TABLE IF NOT EXISTS REPOS (
    repoID serial PRIMARY KEY,
    repo_name VARCHAR (50) UNIQUE NOT NULL,
    language VARCHAR (10) NOT NULL,
	description VARCHAR (100),
	repo_url VARCHAR(50),
	creation_date DATE,
	forks_count integer,
	stargazers_count integer,
	user_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS FRIENDS (
    friendID integer PRIMARY KEY,
    gitusername_1 VARCHAR (75) NOT NULL,
    gitusername_2 VARCHAR (75) NOT NULL
);

insert into Users values (1, 'tylerthedeveloper', 'tyler citrin', 'i like cats', 39.1653, 86.5264, null);
insert into Users values (2, 'abi', 'abi shek', 'afbeggi', 39.1653, 86.5364, null);

UPDATE users SET current_location = ST_POINT(current_latitude, current_longitude);
select * from users where git_username <> 'tylerthedeveloper' and ST_DWithin(current_location, ST_POINT(39.1653, 86.5264), 10000);

