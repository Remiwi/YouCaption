from datetime import datetime, timedelta
import json
import uuid
from fastapi import APIRouter, Form, Request, Response, status
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify

router = APIRouter()


@router.get("/getUsername")
async def getUsername(request: Request):
    sessionid = request.cookies.get("sessionid")
    if sessionid:
        query = "SELECT username FROM sessions JOIN users ON session.userGID = users.googleID WHERE sessionID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(query, (sessionid,))
                username = cursor.fetchone()
                if username[0]:
                    return {"username": username[0], "signedIn": True}
                else:
                    return {"username": "test", "signedIn": False}
    else:
        print("no sessionid")
        return {"username": "test", "signedIn": False}
