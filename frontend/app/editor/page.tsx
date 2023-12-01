'use client'
import TimelineEditor from "./timeline"
import {useEffect, useState} from 'react';
import { FaChevronLeft, FaUpload } from 'react-icons/fa';
import styles from "./page.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import IconButton from './button';
import YoutubeEmbed from "./youtubeplayer";
import Input from "./langinput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPost,fetchPostJSON } from "@/utilities/myFetch";

export default function Home() {
  const [time, setTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [fullDuration, setFullDuration] = useState<number>(0);
  const [subtitleLang, setSubtitleLang] = useState<string>("");
  const [attemptedPublish, setAttemptedPublish] = useState<boolean>(false);


  const router = useRouter();

  const params = useSearchParams();  
  const v = params.get("v");
  if (v === null || v === undefined || v === "") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    let interval: NodeJS.Timeout; 

    if (isVideoPlaying) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1); 
      }, 1000); // 1 second
    } 
    return () => clearInterval(interval);
  }, [isVideoPlaying]); // Only re-run the effect if isVideoPlaying changes


  const publishSubtitles = useMutation({
    mutationKey: ['publishSubtitles'],
    mutationFn: () => fetchPost('http://127.0.0.1:8000/editor/publishSubtitles/' + subtitleLang + "/"),
    onSuccess: (data) => {
      alert('Successfully published subtitles!');
      router.push(`/video?v=${v}`);
    },
    onError: (error) => {
      alert(error);
    },
  });

  const handlePublish = () => {
    setAttemptedPublish(true);
    if (subtitleLang === "") {
      return;
    }
    publishSubtitles.mutate();
    
  }
    return (
      <div style={{width: "90%", margin: "50px"}}>
            <div className={styles.titleBar}>
              <div className={styles.titleBarFirstItem}>
                {/* TO DO: let u go back */}
              {/* <FaChevronLeft/>  */}
              </div>
              <h1>{title}</h1>
              <div className={styles.titleBarRight}>
              <Input onTextChange={setSubtitleLang} attemptPublish={attemptedPublish} />
              </div>
                <IconButton  text={"publish"} Icon={FaUpload} onClick={handlePublish}/>
              </div>
              <div className={styles.video}>
              <YoutubeEmbed embedId={v} onTimeChange={setTime} onVideoStateChange={setIsVideoPlaying} setVideoTitle={setTitle} newTime={time} setDuration={setFullDuration}/>
            </div>
           
        <TimelineEditor newTime={time} onTimeChange = {setTime} newVideoState={isVideoPlaying} onVideoStateChange={setIsVideoPlaying} fullDuration={fullDuration}/>
        </div>
    );
}