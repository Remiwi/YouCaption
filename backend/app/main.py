from datetime import datetime, timedelta
from fastapi import FastAPI, Form, Request, status, Cookie, HTTPException, Response
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from contextlib import closing
from database import get_db_conn
from fastapi.middleware.cors import CORSMiddleware
from routers import login, isLoggedIn, editor
from fastapi.responses import FileResponse

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
app.include_router(editor.router)


@app.middleware('http')
async def check_credentials(request: Request, call_next):
    sessionid = request.cookies.get("sessionid")
    response = await call_next(request)
    # print(sessionid)
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
                    cursor.execute(query, (new_date, sessionid))
                conn.commit()
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.get("/")
async def root():
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
            cursor.execute("SELECT * FROM sessions")
            sessions = cursor.fetchall()
            cursor.execute("SELECT * FROM userFollows")
            userFollows = cursor.fetchall()
            cursor.execute("SELECT * FROM userSavedVideos")
            subscriptions = cursor.fetchall()
            cursor.execute("SELECT * FROM ratings")
            ratings = cursor.fetchall()
            return {
                "users": users,
                "sessions": sessions,
                "Follow Table": userFollows,
                "Subscription Table": subscriptions,
                "ratings": ratings
            }


@app.get("/videoPageCaptionData/{videoID}")
async def getVideoPageCaptionData(videoID: str):
    print("Getting Captions for videoID", videoID)
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            query = """
                SELECT
                    users.username AS author,
                    videoID,
                    captions.language,
                    AVG(ratings.rating) AS avg_rating,
                    captions.id AS captionID
                FROM captions
                    JOIN users ON captions.userGID = users.googleID
                    LEFT JOIN ratings ON captions.id = ratings.captionID
                WHERE captions.videoID = %s
                GROUP BY users.username, captions.videoID, captions.language, captions.id
            """

            cursor.execute(query, (videoID,))
            caps = cursor.fetchall()

            json_data = [
                {
                    "author": cap[0],
                    "videoID": cap[1],
                    "language": cap[2],
                    "rating": {
                        "averageRating": float(cap[3] or 0),
                        "captionID": cap[4]
                    },
                    "download": cap[4]
                } for cap in caps
            ]

            return JSONResponse(content=json_data)


@app.get("/userPageCaptionData/{username}")
async def getUserPageCaptionData(username: str):
    print("Getting Captions for user", username)
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            query = """
                SELECT
                    users.username AS author,
                    videoID,
                    captions.language,
                    AVG(ratings.rating) AS avg_rating,
                    captions.id AS captionID
                FROM captions
                    JOIN users ON captions.userGID = users.googleID
                    LEFT JOIN ratings ON captions.id = ratings.captionID
                WHERE users.username = %s
                GROUP BY users.username, captions.videoID, captions.language, captions.id
            """

            cursor.execute(query, (username,))
            caps = cursor.fetchall()

            json_data = [
                {
                    "author": cap[0],
                    "video": cap[1],
                    "language": cap[2],
                    "rating": {
                        "averageRating": float(cap[3] or 0),
                        "captionID": cap[4]
                    },
                    "download": cap[4]
                } for cap in caps
            ]

            return JSONResponse(content=json_data)


@app.get("/userFollowerCount/{username}")
async def get_userFollowerCount(username: str):
    print("Getting following count of user:", username)
    getFollowingCount = """
                SELECT COUNT(followerGID)
                FROM userFollows as uf
                JOIN users As u ON uf.followingGID = u.googleID
                WHERE u.username = %s
            """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getFollowingCount, (username,))
            numFollowers = cursor.fetchone()
            print("Follow Count is:", numFollowers[0])
            return (numFollowers)


@app.get("/subscriptionListVideo/{videoID}")
async def getSubscriptionListFromVideoID(videoID: str):
    print("Getting subscription list for video:", videoID)
    getSubList = """
        SELECT username
        FROM users as u 
        JOIN userSavedVideos AS usv ON u.googleID = usv.userGID
        WHERE videoID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getSubList, (videoID, ))
            SubList = cursor.fetchall()
            return (SubList)


@app.get("/subscriptionListUser/{username}")
async def getSubscriptionListFromVideoID(username: str):
    print("Getting subscription list for user:", username)
    getSubList = """
        SELECT videoID
        FROM userSavedVideos AS usv
        JOIN users as u ON  usv.userGID = u.googleID
        WHERE username = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getSubList, (username, ))
            SubList = cursor.fetchall()
            return (SubList)


@app.get("/download/{captionID}")
async def download(captionID: int):
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            query = "SELECT file_path FROM captions WHERE id = %s"
            cursor.execute(query, (captionID,))
            file_path = cursor.fetchone()[0]
            return FileResponse(file_path, media_type="text/srt", filename=file_path)
