from datetime import datetime, timedelta
import json
import logging
import uuid
from fastapi import APIRouter, Form, Request, Response, status, Depends, HTTPException
from fastapi import File, UploadFile
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify
from pydantic import BaseModel


async def getUserGID(request: Request):
    sessionid = request.cookies.get("sessionid")
    if sessionid:
        query = "SELECT userGID FROM sessions WHERE sessionID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(query, (sessionid, ))
                userGID = cursor.fetchone()
                if userGID:
                    request.state.userGID = userGID[0]
                else:
                    raise HTTPException(
                        status_code=404, detail="No account found")
                print(userGID)
                query = "SELECT username FROM users WHERE googleID = %s"
                cursor.execute(query, (request.state.userGID, ))
                username = cursor.fetchone()
                if username:
                    request.state.username = username[0]
        # print("userGID: ", request.state.userGID)
        # print("username: ", request.state.username)
    else:
        print("NO SESSION ID")
        raise HTTPException(status_code=401, detail="No Session")
    return request

router = APIRouter(dependencies=[Depends(getUserGID)])


@router.post("/updateLanguage/{newLanguage}")
async def updateLanguage(request: Request, newLanguage: str):
    print("Updating Language to:", newLanguage)
    try:
        changeLanguage = """
                UPDATE users
                SET language = %s
                WHERE googleID = %s
            """
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(
                    changeLanguage, (newLanguage, request.state.userGID))
                conn.commit()
        return {"message": "Update Language Success"}
    except Exception as e:
        logging.error(f"Error updating username: {e}")


@router.get("/currentLanguage")
async def getCurrentLanguage(request: Request):
    print("Getting Current Language")
    query = "SELECT language FROM users WHERE username = %s"
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (request.state.username,))
            curr_language = cursor.fetchone()
            if curr_language:
                print(curr_language)
                return curr_language[0]


@router.get("/getUsername")
async def getUsername(request: Request):
    print(request.state.username)
    return {"username": request.state.username, "signedIn": True}


@router.post("/updateUsername/{newUsername}")
async def updateUsername(request: Request, newUsername: str):
    print("Updating username from", request.state.username, "to", newUsername)
    try:
        updateUsername = "UPDATE users SET username = %s WHERE googleID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(
                    updateUsername, (newUsername, request.state.userGID))
                conn.commit()
    except Exception as e:
        logging.error(f"Error updating username: {e}")
        raise HTTPException(
            status_code=409,
            detail="username taken"
        )


@router.post("/follow/{usernameToFollow}")
async def follow(request: Request, usernameToFollow: str):
    print(request.state.username, "following", usernameToFollow)
    getFollowingGID = "SELECT googleID FROM users WHERE username = %s"
    addFollowing = "INSERT INTO userFollows (followerGID, followingGID) VALUES (%s, %s) ON CONFLICT DO NOTHING"
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getFollowingGID, (usernameToFollow,))
            FollowingGID = cursor.fetchone()
            if not FollowingGID:
                raise HTTPException(
                    status_code=404,
                    detail="attempting to follow a user that does not exist"
                )
            elif FollowingGID[0] == request.state.userGID:
                raise HTTPException(
                    status_code=403,
                    detail="attempting to follow self"
                )
            cursor.execute(
                addFollowing, (request.state.userGID, FollowingGID[0]))
            conn.commit()
    return {"message": "follow success"}


@router.post("/unfollow/{usernameToUnfollow}")
async def unfollow(request: Request, usernameToUnfollow: str):
    print(request.state.username, "following", usernameToUnfollow)
    getUnfollowingGID = "SELECT googleID FROM users WHERE username = %s"
    removeFollowing = "DELETE FROM userFollows WHERE followerGID = %s AND followingGID = %s"
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getUnfollowingGID, (usernameToUnfollow, ))
            UnfollowingGID = cursor.fetchone()
            if not UnfollowingGID:
                raise HTTPException(
                    status_code=404,
                    detail="attempting to unfollow a user that does not exist"
                )
            cursor.execute(removeFollowing,
                           (request.state.userGID, UnfollowingGID[0]))
            conn.commit()


@router.get("/isFollowing/{username}")
async def isFollowing(request: Request, username: str):
    print("Checking if", request.state.username, "is following", username)

    if username == request.state.username:
        return {
            "isSelf": True,
            "following": False,
        }

    query = """
        SELECT * FROM userFollows
        JOIN users ON followingGID = googleID
        WHERE followerGID = %s AND username = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:

            cursor.execute(query, (request.state.userGID, username))
            isFollowing = cursor.fetchone()
            print(isFollowing)
    return {
        "isSelf": False,
        "following": bool(isFollowing),
    }


@router.get("/followingList")
async def getFollowingList(request: Request):
    print("Getting Following List of ", request.state.username)
    getFollowing = """
        SELECT username 
        FROM userFollows 
        JOIN users ON followingGID = googleID 
        WHERE followerGID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getFollowing, (request.state.userGID, ))
            FollowingList = cursor.fetchall()
            print(FollowingList)

    data = [
        {
            "username": entry[0],
        }
        for entry in FollowingList
    ]

    return {"followingList": data}


@router.post("/saveVideo/{videoID}")
async def subscribeToVideo(request: Request, videoID: str):
    print("Subscribing to video with videoID:", videoID)
    subscribe = """
        INSERT INTO userSavedVideos (userGID, videoID) 
        VALUES (%s, %s)
        ON CONFLICT
            DO NOTHING
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(subscribe, (request.state.userGID, videoID))
            conn.commit()
    return {"message": "Subscription Success"}


@router.post("/unsaveVideo/{videoID}")
async def unsubscribeToVideo(request: Request, videoID: str):
    print("Unsubscribing to video with videoID:", videoID)
    unsubscribe = """
        DELETE FROM userSavedVideos WHERE
        userGID = %s AND videoID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(unsubscribe, (request.state.userGID, videoID))
            conn.commit()
    return {"message": "Unsubscription Success"}


@router.get("/isSaved/{videoID}")
async def isSaved(request: Request, videoID: str):
    print("Checking if video is saved with videoID:", videoID)
    query = """
        SELECT * FROM userSavedVideos WHERE
        userGID = %s AND videoID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (request.state.userGID, videoID))
            isSaved = cursor.fetchone()
    return isSaved


@router.get("/savedVideoList")
async def getSubscriptionList(request: Request):
    print("Getting subscription list: ")
    getSubList = """
        SELECT videoID FROM userSavedVideos
        WHERE userGID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(getSubList, (request.state.userGID, ))
            subList = cursor.fetchall()
    print(subList)

    data = [
        {
            "videoID": entry[0],
        }
        for entry in subList
    ]

    return {"savedList": data, }


@router.post("/createUserRating/{captionID}/{rating}")
async def createUserRating(request: Request, captionID: int, rating: int):
    try:
        print("Creating rating of", rating, "for caption", captionID)
        createRating = """
            INSERT INTO ratings
            (captionID, userGID, rating)
            VALUES (%s, %s, %s)
            ON CONFLICT (captionID, userGID) DO UPDATE SET
            rating = EXCLUDED.rating
        """
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(
                    createRating, (captionID, request.state.userGID, rating))
                conn.commit()
        return {"message": "rating created successfully"}
    except Exception as e:
        print(e)
        return HTTPException(status_code=400, detail="Rating Creation Failed")
# needs testing


@router.get("/userRating/{captionID}")
async def getUserRating(request: Request, captionID: int):
    try:
        print("Getting", request.state.userGID,
              "rating for captionID", captionID)
        getRating = """
            SELECT rating
            FROM ratings
            WHERE ratings.userGID = %s AND ratings.captionID = %s;
        """
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(getRating, (request.state.userGID, captionID))
                rating = cursor.fetchone()
        return rating
    except Exception as e:
        print(e)
        return HTTPException(status_code=400, detail="Get User Rating Failed")


class FollowNotifSettingsShape(BaseModel):
    getNotifs: int
    onlyLangMatch: bool


@router.get("/followingNotifSettings")
async def getFollowingNotifSettings(request: Request):
    query = """
        SELECT getNotifsFollowing, onlyNotifyOnLangMatchFollowing
        FROM users
        WHERE googleID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (request.state.userGID, ))
            notifSettings = cursor.fetchone()

    data = {
        "getNotifs": notifSettings[0],
        "onlyLangMatch": notifSettings[1],
    }

    return data


@router.post("/updateFollowingNotifSettings")
async def updateFollowingNotifSettings(request: Request, settings: FollowNotifSettingsShape):
    print("Updating following notifs")
    query = """
        UPDATE users
        SET getNotifsFollowing = %s, onlyNotifyOnLangMatchFollowing = %s
        WHERE googleID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (settings.getNotifs,
                           settings.onlyLangMatch, request.state.userGID))
            conn.commit()
    return {"message": "Update Success"}


@router.get("/videoNotifSettings")
async def getVideoNotifSettings(request: Request):
    query = """
        SELECT getNotifsVideos, onlyNotifyOnLangMatchVideos
        FROM users
        WHERE googleID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (request.state.userGID, ))
            notifSettings = cursor.fetchone()

    data = {
        "getNotifs": notifSettings[0],
        "onlyLangMatch": notifSettings[1],
    }

    return data


@router.post("/updateVideoNotifSettings")
async def updateVideoNotifSettings(request: Request, settings: FollowNotifSettingsShape):
    print("Updating video notifs")
    query = """
        UPDATE users
        SET getNotifsVideos = %s, onlyNotifyOnLangMatchVideos = %s
        WHERE googleID = %s
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (settings.getNotifs,
                           settings.onlyLangMatch, request.state.userGID))
            conn.commit()
    return {"message": "Update Success"}


# add file type checking as well as path validation


@router.post("/caption/{videoID}")
async def createCaption(request: Request, videoID: str, file: UploadFile = File(...)):
    try:
        file_location = f"files/{file.filename}"
        with open(file_location, "wb") as buffer:
            # Read in chunks of 1024 bytes
            while contents := await file.read(1024):
                buffer.write(contents)
        addCaption = """
            INSERT INTO captions
            (userGID, videoID, file_path, language)
            VALUES (%s, %s, %s, %s)
        """
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                language = file.headers.get("Language")
                cursor.execute(addCaption, (request.state.userGID,
                               videoID, file_location, language))
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    except Exception as e:
        print(e)
        return HTTPException(status_code=500, detail="Caption Creation Failure")

# @router.get("/getUsername")
# async def getUsername(request: Request):
#     print("Getting Username")
#     sessionid = request.cookies.get("sessionid")
#     #print("User sessionID: ", sessionid)
#     if sessionid:
#         query = "SELECT username FROM sessions JOIN users ON sessions.userGID = users.googleID WHERE sessionID = %s"
#         with closing(get_db_conn()) as conn:
#             with closing(conn.cursor()) as cursor:
#                 cursor.execute(query, (sessionid,))
#                 username = cursor.fetchone()
#                 if username and username[0]:
#                     return {"username": username[0], "signedIn": True}
#                 else:
#                     return {"username": "test", "signedIn": False}
#     else:
#         print("no sessionid")
#         return {"username": "test", "signedIn": False}
