CREATE TABLE IF NOT EXISTS USERS (
    user_id serial PRIMARY KEY,
    git_username VARCHAR (50) UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    bio TEXT,
    picture_url VARCHAR,
    current_latitude FLOAT,
    current_longitude FLOAT,
    current_location GEOGRAPHY
);

insert into Users values (1, 'tylerthedeveloper', 'tyler citrin','https://avatars2.githubusercontent.com/u/13102536?s=400&u=f2c18d0d8d337109636f143e72e72b790e3b083e&v=4', 'i like cats', 39.1653, 86.5264, null);
insert into Users values (2, 'abi', 'abi shek','https://avatars0.githubusercontent.com/u/1957707?s=400&v=4', 'afbeggi', 39.1653, 86.5364, null);

-- TODO: when do we do this
UPDATE users SET current_location = ST_POINT(latitude, longitude);

select * from users where git_username <> 'tylerthedeveloper' and ST_DWithin(current_location, ST_POINT(39.1653, 86.5264), 10000);

-- TODO: get repoID from github 
CREATE TABLE IF NOT EXISTS REPOS (
    repo_id serial PRIMARY KEY,
    repo_name VARCHAR (50) UNIQUE NOT NULL,
    language VARCHAR (10) NOT NULL,
	description VARCHAR (100),
	repo_url VARCHAR(50),
	creation_date DATE,
	forks_count integer,
	stargazers_count integer,
	user_name VARCHAR(50)
);

-- TODO: add index on gitusername_1
CREATE TABLE IF NOT EXISTS FRIENDS (
    gitusername_1 VARCHAR (75) NOT NULL,
    gitusername_2 VARCHAR (75) NOT NULL
);

insert into FRIENDS values ('tylerthedeveloper', 'kanikeabhishek');
insert into FRIENDS values ('kanikeabhishek', 'tylerthedeveloper');

-- FIRST TEST
CREATE TRIGGER notify_new_user 
AFTER INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE notify_new_user();

CREATE OR REPLACE FUNCTION notify_new_user() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('user_watcher', 'users' || ',git_username,' || NEW.git_username );
  RETURN new;
END;
$$ LANGUAGE plpgsql;



-- SECOND TEST --
CREATE TRIGGER trigger_update_location 
AFTER UPDATE ON users
FOR EACH ROW 
WHEN (OLD.current_location <> NEW.current_location)
EXECUTE PROCEDURE notify_update_location();

-- CREATE OR REPLACE FUNCTION notify_update_location() 
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM pg_notify(CAST('user_update_location' AS text), (
--         select json_agg(row_to_json(users))
--             from users 
--             where git_username <> NEW.git_username and
--                 ST_DWithin(current_location, ST_POINT(NEW.latitude, NEW.longitude), 10000)
--         )::text
--     );
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_update_location() 
RETURNS trigger AS $$
BEGIN
    raise notice '%', new::text;
    PERFORM pg_notify(CAST('user_update_location' AS text), (
        select json_build_object('newUser',
            (select row_to_json(newUser) from (select * from users where git_username = NEW.git_username) as newUser), 
            'localUsers',
            (select array_agg(user_id) as local_users
            from users 
            where git_username <> NEW.git_username and
            ST_DWithin(current_location, ST_POINT(NEW.latitude, NEW.longitude), 10000))
        )::text)
    );
    -- PERFORM pg_notify('user_update_location', 'updated');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



select json_build_object('newUser',
    (select row_to_json(newUser) from (select * from users where git_username = 'tylerthedeveloper') as newUser), 
    'localUsers',
    (select array_agg(user_id) as local_users
    from users 
    where git_username <> 'tylerthedeveloper' and
    ST_DWithin(current_location, ST_POINT(39.172767, -86.523198), 10000))
);
--insert into users(git_username, name, user_id) values ('de', 'de', 2223);