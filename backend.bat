cd backend
call env\Scripts\activate
cd app
start /b cmd /c python -m uvicorn main:app --reload
