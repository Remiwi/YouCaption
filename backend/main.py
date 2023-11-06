from fastapi import FastAPI, Form, Request, status
from fastapi.responses import JSONResponse
from typing import Annotated
from contextlib import closing
from database import get_db_conn
from fastapi.middleware.cors import CORSMiddleware
from googleAuth import verify

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

@app.get("/")
async def root():
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute("SELECT * FROM captions")
            result = cursor.fetchall()
            return {"message": result}


@app.post("/login")
async def validate(credential: Annotated[str, Form()], request: Request):
    userData = verify(credential)
    print(userData)
    return(userData)
    # csrf_token_cookie = request.cookies.get('g_csrf_token')
    # if not csrf_token_cookie:
    #     return JSONResponse("No CSRF token in Cookie.", status_code=status.HTTP_400_BAD_REQUEST)
    # csrf_token_body = request.get('g_csrf_token')
    # if not csrf_token_body:
    #     return JSONResponse("No CSRF token in post body.", status_code=status.HTTP_400_BAD_REQUEST)
    # if csrf_token_cookie != csrf_token_body:
    #     return JSONResponse('Failed to verify double submit cookie.', status_code=status.HTTP_400_BAD_REQUEST)
    # print(credential)


 