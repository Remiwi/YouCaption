import configparser
import psycopg2
from contextlib import closing


def get_db_conn():
    # Load database configuration from config.ini
    try:
        config = configparser.ConfigParser()
        config.read('config.ini')

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
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS dummy (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL
        )
        ''')
        conn.commit()

        cursor.execute("INSERT INTO dummy (name) VALUES ('John Doe')")
        conn.commit()
