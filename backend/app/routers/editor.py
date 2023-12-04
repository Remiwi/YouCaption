from datetime import datetime, timedelta
import json
import logging
import uuid
from fastapi import FastAPI, APIRouter, Form, Request, Response, status, Depends, HTTPException
from typing import Annotated
from contextlib import closing
from dependencies import get_db_conn, verify
from .isLoggedIn import getUserGID
from sendEmail import sendEmail


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
        self.subtitleBlocks = [SubtitleBlock(
            text="", start_time=0, end_time=4)]
        self.language = language
        self.entryTimeCreated = datetime.now()
        self.videoID = vID

    def __str__(self):
        subtitle_info = ', '.join(
            [f'Text: "{block.text}", Start: {block.start_time}, End: {block.end_time}' for block in self.subtitleBlocks])
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
userTimelines = {}

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


@router.post("/addNewBlock")
async def addNewBlock(request: Request):
    """
    Called when user creates a new block on their timeline
    """
    body = await request.json()
    new_caption_block = SubtitleBlock(text=body.get(
        'text'), start_time=body.get('startTime'), end_time=body.get('endTime'))
    if request.state.userGID in userTimelines:
        currBlockEntry = userTimelines[request.state.userGID]
        currBlockEntry.subtitleBlocks.append(new_caption_block)
        userTimelines[request.state.userGID] = currBlockEntry
        srt = currBlockEntry.convert_into_srt_text()
        print("srt: " + srt)
        print(str(userTimelines[request.state.userGID].subtitleBlocks))
        return {"message": "Caption added successfully"}
    else:
        return HTTPException(status_code=500, detail="Add Block Failure (try clicking the make sub button first)")


@router.post("/deleteBlock")
async def deleteBlock(request: Request):
    """
    Called when user deletes a block on their timeline

    The user can only delete the last block on their timeline
    """
    if request.state.userGID in userTimelines:
        currBlockEntry = userTimelines[request.state.userGID]
        currBlockEntry.subtitleBlocks.pop()
        userTimelines[request.state.userGID] = currBlockEntry
    else:
        return HTTPException(status_code=500, detail="Delete Block Failure (try clicking the make sub button first)")


@router.post("/editExistingBlock")
async def editExistingBlock(request: Request):
    """
    Called when user adjusts the time/content of their subtitle block
    """
    body = await request.json()
    idToReplace = body.get('blockID')
    new_caption_block = SubtitleBlock(text=body.get(
        'text'), start_time=body.get('startTime'), end_time=body.get('endTime'))
    if request.state.userGID in userTimelines:
        currBlockEntry = userTimelines[request.state.userGID]
        currBlockEntry.subtitleBlocks[idToReplace] = new_caption_block
        userTimelines[request.state.userGID] = currBlockEntry
        debugPrintSRT(currBlockEntry)
    else:
        return HTTPException(status_code=500, detail="Editing Block Failure (try clicking the make sub button first)")


@router.post("/publishSubtitles/{language}")
async def publishSubtitles(request: Request, language: str):
    """
    Called when user publishes their subtitles
    Creates a .srt file, stores it in UserCaptionFiles directory, evicts user's entry, and stores user's caption file path in database
    """
    try:
        query = """
            INSERT INTO captions
            (userGID, videoID, file_path, language)
            VALUES (%s, %s, %s, %s)
        """
        userTimelineEntry = userTimelines[request.state.userGID]
        vID = userTimelineEntry.videoID
        language = language.replace(" ", "_")
        file_name = f"{request.state.userGID}_{vID}_{language}.srt"
        directory = "../UserCaptionFiles/"
        file_path = directory + file_name
        srtContents = userTimelineEntry.convert_into_srt_text()
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(srtContents)

        with closing(get_db_conn()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute(query, (request.state.userGID,
                               vID, file_path, language))
                conn.commit()

        # evicts current entry so user's can begin a new project
        del userTimelines[request.state.userGID]
        # send emails
        sendEmail(vID, request.state.userGID, language)
        return {"message": "Subtitles published successfully"}
    except Exception as e:
        print(e)
        return HTTPException(status_code=500, detail="Publish failed")


@router.get("/userExistingTimeline")
async def getUserExistingTimeline(request: Request):
    """
    Called when user opens the editor page on a video they have already created subtitles for

    Exists so that users can essentially have a subtitle file "draft"
    """
    print("Getting Existing Timeline for User:", request.state.username)

    if request.state.userGID not in userTimelines:
        raise HTTPException(status_code=404, detail="Timeline not found")
    else:
        timeline_entry = userTimelines[request.state.userGID]
        print("timeline_entry: " + timeline_entry.convert_into_srt_text())
        subtitle_blocks_json = []
        for i, block in enumerate(timeline_entry.subtitleBlocks):
            start_time = block.start_time
            end_time = block.end_time
            subtitle_blocks_json.append({
                "id": i,
                "start": start_time,
                "end": end_time,
                "effectID": "effect0",
                "text": block.text,
            })
        return json.dumps(subtitle_blocks_json)

# Other helpers


def parse_srt(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    blocks = content.split('\n\n')

    for i in range(len(blocks)):
        if blocks[i] == '':
            blocks.pop(i)
    subtitles = []
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:
            index = int(lines[0])
            time = lines[1]
            s, e = srt_time_to_decimal(time)
            text = '\n'.join(lines[2:])
            subtitles.append({'index': index, 'startTime': s,
                             'endTime': e, 'text': text})
        elif len(lines) == 2:
            index = int(lines[0])
            time = lines[1]
            s, e = srt_time_to_decimal(time)
            text = ''
            subtitles.append({'index': index, 'startTime': s,
                             'endTime': e, 'text': text})
        elif lines == ['']:
            continue
    return subtitles


def convert_to_srt_time(decimal_time):
    """
    Converts decimal time (in seconds) to SRT format time.
    """
    hours = int(decimal_time // 3600)
    minutes = int((decimal_time % 3600) // 60)
    seconds = int(decimal_time % 60)

    milliseconds = int((decimal_time - int(decimal_time)) * 1000)

    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"


def srt_time_to_seconds(srt_time):
    """
    Converts a time string from SRT format (HH:MM:SS,MS) to seconds as a decimal.
    """
    hours, minutes, seconds = srt_time.split(':')
    seconds, milliseconds = seconds.split(',')
    total_seconds = int(hours) * 3600 + int(minutes) * 60 + \
        int(seconds) + int(milliseconds) / 1000
    return total_seconds


def srt_time_to_decimal(srt_time):
    """
    Converts SRT time format to decimal seconds.
    """
    start_time_str, end_time_str = srt_time.split(' --> ')

    def convert_to_seconds(time_str):
        """Converts time string to seconds."""
        hours, minutes, seconds = time_str.split(':')
        milliseconds = seconds.split(',')[1]
        seconds = seconds.split(',')[0]
        return int(hours) * 3600 + int(minutes) * 60 + int(seconds) + int(milliseconds) / 1000

    start_seconds = convert_to_seconds(start_time_str)
    end_seconds = convert_to_seconds(end_time_str)

    return (start_seconds, end_seconds)


def debugPrintSRT(block):
    srtdata = block.convert_into_srt_text()
    print("srtdata: " + srtdata)
