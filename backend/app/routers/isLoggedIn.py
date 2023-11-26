from datetime import datetime, timedelta
import json
import uuid
from fastapi import APIRouter, Form, Request, Response, status
from typing import Annotated
from contextlib import closing
from ..dependencies import get_db_conn, verify

router = APIRouter()


@router.get("/ajshgdsadhj")
async def getUsername(request: Request):
    token = request.cookies.get("token")
    print("token: ", token)
    return {"username": "test"}
