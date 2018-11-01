CREATE TABLE IF NOT EXISTS USERS (
    user_id serial PRIMARY KEY,
    git_username VARCHAR (50) UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    bio TEXT,
    current_latitude FLOAT,
    current_longitude FLOAT,
    current_location GEOGRAPHY
);

insert into Users values (1, 'tylerthedeveloper', 'tyler citrin', 'i like cats', 39.1653, 86.5264, null);
insert into Users values (2, 'abi', 'abi shek', 'afbeggi', 39.1653, 86.5364, null);

UPDATE users SET current_location = ST_POINT(current_latitude, current_longitude);
select * from users where user_id <> 1 and ST_DWithin(current_location, ST_POINT(39.1653, 86.5264), 10000);