from datetime import datetime, timedelta
import json
import logging
import uuid
from fastapi import FastAPI, APIRouter, Form, Request, Response, status, Depends, HTTPException
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify
from .isLoggedIn import getUserGID

class SubtitleBlock:
    def __init__(self, text, start_time, end_time):
        self.text = text           
        self.start_time = start_time 
        self.end_time = end_time     

    def __str__(self):
        return f"Text: {self.text}, Start Time: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}, End Time: {self.end_time.strftime('%Y-%m-%d %H:%M:%S')}"

    def convert_into_srt_text(self, i):    
        start_time = convert_to_srt_time(self.start_time)
        end_time = convert_to_srt_time(self.end_time)
        text = self.text.replace('\n', '\n') 
        return (f"{i}\n{start_time} --> {end_time}\n{text}\n")

class TimelineEntry:
    def __init__(self, language, vID):
        self.subtitleBlocks = [SubtitleBlock(text="", start_time=0, end_time=4)]
        self.language = language
        self.entryTimeCreated = datetime.now()
        self.videoID = vID

    def __str__(self):
        subtitle_info = ', '.join([f'Text: "{block.text}", Start: {block.start_time}, End: {block.end_time}' for block in self.subtitleBlocks])
        return (f"TimelineEntry(Language: {self.language}, "
                f"Created: {self.entryTimeCreated.strftime('%Y-%m-%d %H:%M:%S')}, "
                f"Subtitles: [{subtitle_info}])")
    
    def __repr__(self):
        return (f"TimelineEntry(language={self.language!r}, "
                f"entryTimeCreated={self.entryTimeCreated!r}, subtitleBlocks={self.subtitleBlocks!r})")
   
    def convert_into_srt_text(self):
        srt_format = []
        for i, block in enumerate(self.subtitleBlocks, start=1):
            srt_format.append(block.convert_into_srt_text(i))
        return '\n'.join(srt_format)
    
"""
key is userID
value is TimelineEntry 

TODO: vacate old entries based on entryTimeCreated
"""
userTimelines =  {}

router = APIRouter(
    prefix="/editor",
    dependencies=[Depends(getUserGID)]
)

@router.post("/createNewTimeline/{vID}/{overwrite}")
async def createNewTimeline(request: Request, vID: str, overwrite: bool):
    """
    Responsible for creating a entry in the userTimelines dictionary for the user
    
    Each user only is allowed one timeline at a time regardless of language
    """
    if request.state.userGID in userTimelines and userTimelines[request.state.userGID].videoID != vID and not overwrite:
        return {
            "warning": "About to overwrite existing draft",
            "videoID": userTimelines[request.state.userGID].videoID
        }
    elif request.state.userGID in userTimelines and userTimelines[request.state.userGID].videoID == vID:
        return {"message": "proceeding with exisitng timeline"}
    else:
        newBlockEntry = TimelineEntry(language="", vID=vID)
        userTimelines[request.state.userGID] = newBlockEntry
        return {"message": "New timeline created successfully", "videoID": vID}
