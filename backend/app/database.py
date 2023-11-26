import configparser
import psycopg2
from contextlib import closing


def get_db_conn():
    # Load database configuration from config.ini
    try:
        config = configparser.ConfigParser()
        config.read('../config.ini')

        # Get the database connection details from the config file
        db_host = config['database']['host']
        db_port = config['database']['port']
        db_name = config['database']['dbname']
        db_user = config['database']['user']
        db_password = config['database']['password']

        # Establish and return a database connection
        return psycopg2.connect(
            host=db_host,
            port=db_port,
            dbname=db_name,
            user=db_user,
            password=db_password
        )
    except Exception as e:
        print(f"Error: {e}")
        return None


with closing(get_db_conn()) as conn:
    with closing(conn.cursor()) as cursor:
        # Set up tables here if need be; don't do it in psql since that won't reflect on other machines

        # onlyNotifyOnLangMatchFollowing is true if the user only wants to be notified of a following user uploading a new caption
        # when that caption is in the chosen language
        # onlyNotifyOnLangMatchVideos is true if the user only wants to be notified of a saved video receiving a new caption when
        # that caption is in the chosen language

        # this is the command to drop all the tables in the schema
        # be careful when using this!!!

        # cursor.execute('''
        #     DO $$
        #     DECLARE
        #         r record;
        #     BEGIN
        #         FOR r IN SELECT quote_ident(tablename) AS tablename, quote_ident(schemaname) AS schemaname FROM pg_tables WHERE schemaname = 'public'
        #         LOOP
        #             RAISE INFO 'Dropping table %.%', r.schemaname, r.tablename;
        #             EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', r.schemaname, r.tablename);
        #         END LOOP;
        #     END$$;
        # ''')

        # conn.commit()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            googleID VARCHAR(255) PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            language VARCHAR(255) NOT NULL DEFAULT 'EN',
            onlyNotifyOnLangMatchFollowing BOOLEAN NOT NULL DEFAULT FALSE,
            onlyNotifyOnLangMatchVideos BOOLEAN NOT NULL DEFAULT FALSE
        )
        ''')
        conn.commit()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS captions (
            id SERIAL PRIMARY KEY,
            userGID VARCHAR(255) NOT NULL,
            videoID VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) UNIQUE NOT NULL,
            language VARCHAR(255),
            rating INT,
            FOREIGN KEY (userGID) REFERENCES users(googleID)
        )
        ''')
        conn.commit()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS userFollows (
            followerGID VARCHAR(255) NOT NULL,
            followingGID VARCHAR(255) NOT NULL,
            PRIMARY KEY (followerGID, followingGID),
            FOREIGN KEY (followerGID) REFERENCES users(googleID),
            FOREIGN KEY (followingGID) REFERENCES users(googleID)
        )
        ''')
        conn.commit()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS userSavedVideos (
            userGID VARCHAR(255) NOT NULL,
            videoID VARCHAR(255) NOT NULL,
            PRIMARY KEY (userGID, videoID),
            FOREIGN KEY (userGID) REFERENCES users(googleID)
        )
        ''')
        conn.commit()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            sessionID UUID PRIMARY KEY,
            userGID VARCHAR(255) NOT NULL,
            session_data JSONB,
            expiration TIMESTAMP,
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )           
        ''')
        conn.commit()
