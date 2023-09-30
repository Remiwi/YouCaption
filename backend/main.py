from fastapi import FastAPI
from contextlib import closing
from database import get_db_conn


app = FastAPI()


@app.get("/")
async def root():
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute("SELECT * FROM dummy")
            result = cursor.fetchall()
            return {"message": result}
