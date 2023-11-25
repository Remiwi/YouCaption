from datetime import datetime, timedelta
import json
import uuid
from fastapi import APIRouter, Form, Request, Response, status
from typing import Annotated
from contextlib import closing
from ..dependencies import get_db_conn, verify
import random

router = APIRouter()
