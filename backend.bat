cd backend/app
call env\Scripts\activate
start /b cmd /c python -m uvicorn main:app --reload
