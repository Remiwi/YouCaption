from datetime import datetime, timedelta
import json
import logging
import uuid
from fastapi import APIRouter, Form, Request, Response, status, Depends, HTTPException
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify

router = APIRouter(
    prefix="/editor"
)