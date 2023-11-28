from datetime import datetime, timedelta
import json
import logging
import uuid
from fastapi import APIRouter, Form, Request, Response, status, Depends, HTTPException
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify



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
                print(userGID)
                query = "SELECT username FROM users WHERE googleID = %s"
                cursor.execute(query, (request.state.userGID, ))
                username = cursor.fetchone()
                if username:
                    request.state.username = username[0]
        print("userGID: ", request.state.userGID)
        print("username: ", request.state.username)
    else:
        print("NO SESSION ID")
    return request

router = APIRouter(dependencies=[Depends(getUserGID)])

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
            
@router.get("/username")
async def getUsername(request: Request):
    print("Getting Username from simple")
    print(request.state.username)
    return(request.state.username)

@router.post("/updateUsername/{newUsername}")
async def updateUsername(request: Request, newUsername: str):
    print("Updating username from", request.state.username, "to", newUsername)
    try:
        updateUsername = "UPDATE users SET username = %s WHERE googleID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(updateUsername, (newUsername, request.state.userGID))
                conn.commit()
    except Exception as e:
        logging.error(f"Error updating username: {e}")
        raise HTTPException(
            status_code=409,
            detail="username taken"
        )


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

    return {"Following List": FollowingList}

    
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
            cursor.execute(addFollowing, (request.state.userGID, FollowingGID[0]))
            conn.commit()
    return {"message": "follow success"}

@router.post("/unfollow/{usernameToUnfollow}")
async def unfollow(request: Request, usernameToUnfollow:str):
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
            cursor.execute(removeFollowing, (request.state.userGID, UnfollowingGID[0]))
            conn.commit()

    


@router.get("/getUsername")
async def getUsername(request: Request):
    print("Getting Username")
    sessionid = request.cookies.get("sessionid")
    #print("User sessionID: ", sessionid)
    if sessionid:
        query = "SELECT username FROM sessions JOIN users ON sessions.userGID = users.googleID WHERE sessionID = %s"
        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(query, (sessionid,))
                username = cursor.fetchone()
                if username and username[0]:
                    return {"username": username[0], "signedIn": True}
                else:
                    return {"username": "test", "signedIn": False}
    else:
        print("no sessionid")
        return {"username": "test", "signedIn": False}
