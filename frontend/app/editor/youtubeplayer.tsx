import React, {useEffect, useRef} from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
// need to figure out how to call time change when 
// seeking through the video

// need to be able to have runner align with video


type YoutubeEmbedProps = {
  embedId: string;
  onTimeChange:  React.Dispatch<React.SetStateAction<number>>;
  onVideoStateChange: (newState: boolean) => void;
  setVideoTitle: (title: string) => void;
  newTime: number;
  setDuration: (duration: number) => void;
};

const YoutubeEmbed: React.FC<YoutubeEmbedProps>  = ({ embedId, onTimeChange, onVideoStateChange, setVideoTitle, newTime, setDuration })  => {
  const videoRef = useRef<YouTube>(null);
  
  useEffect(() => {
    if (videoRef.current && newTime !== undefined) {
      videoRef.current.getInternalPlayer().seekTo(newTime);
    }
  }, [newTime]);

  const handleTimeChange = (event: any) => {
    onTimeChange(event.target.getCurrentTime());
    if (videoRef.current) {
      console.log(videoRef.current.getInternalPlayer().getCurrentTime());
    }
    
  }


  const onPlayerReady:  YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
    setVideoTitle(event.target.getVideoData().title);
    setDuration(event.target.getDuration());
  };

  const playVideo:  YouTubeProps['onPlay'] = (event) => {
    event.target.playVideo();
    onVideoStateChange(true);
  };


  const pauseVideo:  YouTubeProps['onPause'] = (event) => {
    event.target.pauseVideo();
    onVideoStateChange(false);
  };


  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };



  return <YouTube 
  videoId={embedId}
  opts={opts} 
  onReady={onPlayerReady} 
  style={{ aspectRatio: "16/9", width: "50%", height: "auto"}} 
  onPlay={playVideo}
  onPause={pauseVideo}
  onStateChange={handleTimeChange}
  />;
};

export default YoutubeEmbed;


