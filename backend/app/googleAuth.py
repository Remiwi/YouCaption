from google.oauth2 import id_token
from google.auth.transport import requests
CLIENT_ID = "258135953958-mgpvgvkajfc6gv30k6ldbih4v08deq45.apps.googleusercontent.com"

def verify(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        return(idinfo)
    except ValueError:
        pass

