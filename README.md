# Setup

Cute little guide for y'all to get set up quickly and hopefully understand roughly what it is you're doing <3 -Remi

## Frontend

This shouldn't require any setup. To run the Next server (the thing that serves the content to your browser) run `npm run dev` in a new terminal from `/frontend`.

## Backend

### PostgreSQL

1. Install [PostgreSQL version 16](https://www.postgresql.org/download/). From what I understand, the PostgreSQL server is by default always running; meaning you don't need to start/stop it. If that's something you want to do for the sake of performance, you can figure out how to do that, but keep in mind you will then have to manually turn it on again every time. The performance difference is negligibile (ChatGPT, 2023).

2. Launch psql. This is a program that will connect to your database. You can log into psql using any user you have created, but on a fresh install the default user is called `postgres` (which will have all priviledges; it's like the admin account for the PostgreSQL server) and the password is the one you gave it during the install process (at least that's how it worked in Windows, in Mac it may be different). To use psql with t, use `psql -U postgres`, then enter the password when prompted.

3. Create a new user in psql. This is going to be username/password pair you use to connect to the DB server from the API server. In theory you could use the `postgres` user for this, but you probably shouldn't. Run `CREATE ROLE new_username WITH LOGIN PASSWORD 'new_password' CREATEDB;` from within psql, replacing the username and password to what you want.

4. Create the `youcaption` database. This is gonna be your version of the database; it will share the same structure (the python code ensures that), but it won't have the same entries. Open a new terminal (you can close the old one) and run `psql -U your_username -d postgres` to open the `postgres` database (a default database that gets added when you install PostgreSQL) as your new user. Then run `CREATE DATABASE youcaption` to create the database. You can close this terminal now and probably forget about psql unless you need it for debugging the database.

5. Change your version of `backend/config.ini`. This is just a file that isn't synced to github that will have each of our login info. You should change the `user` and `password` fields to match the user you created, and `port` to match whatever port you specified during the PostgreSQL installation process.

### FastAPI server

Installing dependencies:

1. Activate the virtual enviornment. This is just the python thing you use to keep installations separate. In a new terminal, from `/backend`, run `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Mac/Linux.

2. Install the dependencies. These are in the `requirements.txt` file. With the virtual environment activated, run `pip install -r requirements.txt`.

3. At any time you can deactivate the virtual environment by entering `deactivate` in the terminal where you activated it.

Running the server:

1. Activate the virutal environment. In a new terminal, from `/backend`, run `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Mac/Linux.

2. Run `python -m uvicorn main:app --reload`. `main` refers to `main.py`, our entry point. `app` is the object we make inside our entrypoint: `app = FastAPI()`. `--reload` is to make the server restart after code changes (only use for development).

3. At any time you can deactivate the virtual environment by entering `deactivate` in the terminal where you activated it.
