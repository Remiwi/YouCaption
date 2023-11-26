from datetime import datetime, timedelta
from fastapi import FastAPI, Form, Request, status, Cookie, HTTPException, Response
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from contextlib import closing
from database import get_db_conn
from fastapi.middleware.cors import CORSMiddleware
from routers import login, isLoggedIn

app = FastAPI()

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router)
app.include_router(isLoggedIn.router)


@app.middleware('http')
async def check_credentials(request: Request, call_next):
    sessionid = request.cookies.get("sessionid")
    response = await call_next(request)
    print(sessionid)
    if sessionid:
        # query for finding the session id in the id table
        query = "SELECT * FROM sessions WHERE sessionID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(query, (str(sessionid),))
                sid = cursor.fetchone()
                if not sid:
                    print("here")
                    response.delete_cookie(key="sessionid")
                elif sid[3] <= datetime.now():
                    print("here2")
                    print(sid[4], datetime.now())
                    response.delete_cookie(key="sessionid")
                    cursor.execute(
                        "DELETE FROM sessions WHERE sessionid = %s", (sessionid, ))
                else:
                    query = """
                        UPDATE sessions
                        SET expiration = %s
                        WHERE sessionid = %s
                    """
                    current_date = datetime.now()
                    one_week = timedelta(weeks=1)
                    new_date = current_date + one_week
                    print(new_date)
                    cursor.execute(query, (new_date, sessionid))
                conn.commit()
    return response


@app.get("/")
async def root():
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
            cursor.execute("SELECT * FROM sessions")
            sessions = cursor.fetchall()
            return {"users": users, "sessions": sessions}


@app.get("/vidPgCapData/{videoID}")
async def get_VCapDataList(videoID: str):
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            query = "SELECT author, language, rating, file_path FROM captions WHERE videoID = %s"

            cursor.execute(query, (videoID,))
            caps = cursor.fetchall()

            capList = [cap[0] for cap in caps]
            return (capList)


@app.get("/pfPgCapData/{videoID}")
async def get_PCapDataList(userGID: str):
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            query = "SELECT author, language, rating, file_path FROM captions WHERE userGID = %s"

            cursor.execute(query, (userGID,))
            caps = cursor.fetchall()

            capList = [cap[0] for cap in caps]
            return (capList)


@app.get("/testt")
async def testt():
    return {"message": "testt"}
