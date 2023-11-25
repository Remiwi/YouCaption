from datetime import datetime, timedelta
import json
import uuid
from fastapi import APIRouter, Form, Request, Response, status
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify
import random

router = APIRouter()

adjectives = [
    "Adventurous", "Brave", "Clever", "Daring", "Energetic", "Fearless",
    "Gracious", "Humorous", "Intelligent", "Joyful", "Kind", "Lively",
    "Mystical", "Noble", "Optimistic", "Peaceful", "Quirky", "Radiant",
    "Spirited", "Tranquil", "Unique", "Vivacious", "Wise", "Youthful", "Zealous",
    "Agile", "Bold", "Creative", "Determined", "Elegant"
]

nouns = [
    "Panther", "Eagle", "Wizard", "Knight", "Dragon", "Phoenix", "Unicorn",
    "Voyager", "Titan", "Ranger", "Samurai", "Oracle", "Ninja", "Maverick",
    "Lynx", "Gladiator", "Falcon", "Explorer", "Dynamo", "Crusader", "Captain",
    "Baron", "Astro", "Archer", "Ace", "Warrior", "Voyager", "Titan", "Sage", "Rebel"
]


def gen_username():
    adj = random.choice(adjectives)
    noun = random.choice(nouns)
    number = random.randint(1, 9999)
    username = f"{adj}{noun}{number}"
    return username


@router.post("/login")
async def validate(credential: Annotated[str, Form()], request: Request, response: Response):
    print("User logging in")
    try:
        userData = verify(credential)
        gid = userData["sub"]
        email = userData["email"]
        username = gen_username()
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                # create the user account if it does not exist already
                query = "SELECT EXISTS (SELECT 1 FROM users WHERE googleID = %s)"
                cursor.execute(query, (gid,))
                user = cursor.fetchone()[0]
                if not user:
                    username_query = "SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)"
                    username_taken = True
                    while username_taken:
                        username = gen_username()
                        cursor.execute(username_query, (username,))
                        username_taken = cursor.fetchone()[0]
                    query = """
                        INSERT INTO users (googleID, username, email)
                        VALUES (%s, %s, %s)
                    """
                    cursor.execute(query, (gid, username, email))
                conn.commit()

        # creating a new session for the user
        sessionid = uuid.uuid4()
        current_date = datetime.now()
        one_week = timedelta(weeks=1)
        new_date = current_date + one_week
        insert_query = """
            INSERT INTO sessions (sessionID, userGID, expiration, creation) 
            VALUES (%s, %s, %s, %s)
        """
        values = (str(sessionid), gid, new_date, current_date)
        print("values: ", values)
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                # destroying innactive sessions
                cursor.execute(
                    "DELETE FROM sessions where userGID = %s", (gid, ))
                cursor.execute(insert_query, values)
                conn.commit()
        print("userdata: ", userData)
        response.set_cookie(key="sessionid", value=sessionid,
                            samesite="none", secure="true")
        return (userData)
    except Exception as e:
        print(e)
        return {"message": "error"}
    # csrf_token_cookie = request.cookies.get('g_csrf_token')
    # if not csrf_token_cookie:
    #     return JSONResponse("No CSRF token in Cookie.", status_code=status.HTTP_400_BAD_REQUEST)
    # csrf_token_body = request.get('g_csrf_token')
    # if not csrf_token_body:
    #     return JSONResponse("No CSRF token in post body.", status_code=status.HTTP_400_BAD_REQUEST)
    # if csrf_token_cookie != csrf_token_body:
    #     return JSONResponse('Failed to verify double submit cookie.', status_code=status.HTTP_400_BAD_REQUEST)
    # print(credential)


@router.post("/logout")
async def logout(request: Request, response: Response):
    sessionid = request.cookies.get("sessionid")
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                "DELETE FROM sessions WHERE sessionid = %s", (sessionid, ))
            conn.commit()
    response.delete_cookie("sessionid")
    response.status_code = status.HTTP_200_OK
    return response
