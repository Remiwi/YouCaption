import React, { FC, useEffect, useState, useRef, use } from 'react';
import { TimelineState } from '@xzdarcy/react-timeline-editor';

interface TimelinePlayerProps {
  timelineState: React.MutableRefObject<TimelineState>;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
  newTime: number;
  onTimeChange: (newTime: number) => void;
  newVideoState: boolean;
  onVideoStateChange: (newState: boolean) => void;

}

const TimelinePlayer: FC<TimelinePlayerProps> = ({ timelineState, autoScrollWhenPlay, newTime,  onTimeChange, newVideoState, onVideoStateChange}) => {
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!timelineState.current) return;
  const engine = timelineState.current;

  engine.listener.on('play', () => {
    onVideoStateChange(true);
  });
  engine.listener.on('paused', () => {
    onVideoStateChange(false);
    clearTimeUpdateInterval();
  });
  engine.listener.on('afterSetTime', ({ time }) => {
    onTimeChange(time);
  });

  return () => {
    engine.pause();
    engine.listener.offAll();
    clearTimeUpdateInterval();
  };
}, []);



  const clearTimeUpdateInterval = () => {
    if (timeUpdateInterval.current !== null) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  };

  useEffect(() => {
    if (timelineState.current) {
      timelineState.current.setTime(newTime); // Update the timeline time
    }
  }, [newTime]);



  // const timeRender = (time: number) => {
  //   const float = (parseInt((time % 1) * 100 + '') + '').padStart(2, '0');
  //   const min = (parseInt(time / 60 + '') + '').padStart(2, '0');
  //   const second = (parseInt((time % 60) + '') + '').padStart(2, '0');
  //   return <>{`${min}:${second}.${float.replace('0.', '')}`}</>;
  // };

  const timeRender = (time: number) => {
    const hours = (parseInt(time / 3600 + '') + '').padStart(2, '0');
    const min = (parseInt((time % 3600) / 60 + '') + '').padStart(2, '0');
    const second = (parseInt(time % 60 + '') + '').padStart(2, '0');
    return <>{`${hours}:${min}:${second}`}</>;
  };

  return (
    <div className="timeline-player">

              {/* <p>{newTime}</p>
        <p>fhieods</p>
        <p>{newVideoState ? "true":"false"}</p>

      <div className="time">{timeRender(newTime)}</div> */}
    </div>
  );
};

export default TimelinePlayer;


// import React, { FC, useEffect, useState, useRef } from 'react';
// import { TimelineState } from '@xzdarcy/react-timeline-editor';

// type TimelinePlayerProps = {
//   timelineState: React.MutableRefObject<TimelineState | undefined>;
// };

// const TimelinePlayer: FC<TimelinePlayerProps> = ({ timelineState }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [time, setTime] = useState(0);
//   const timelineStateRef = timelineState.current;

//   useEffect(() => {
//     if (!timelineState.current) return;
//     const engine = timelineState.current;
//     engine.listener.on('play', () => setIsPlaying(true));
//     engine.listener.on('paused', () => setIsPlaying(false));
//     engine.listener.on('afterSetTime', ({ time }) => setTime(time));

//     engine.listener.on('setTimeByTick', ({ time }) => {
//       setTime(time);
//     });
//     // if (autoScrollWhenPlay.current) {
//     //   const autoScrollFrom = 500;
//     //   const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
//     //   timelineState.current.setScrollLeft(left)
//     // }

//     return () => {
//       if (!engine) return;
//       engine.pause();
//       engine.listener.offAll();
//     };
//   }, []);

//   // Handle play or pause.
//   const handlePlayOrPause = () => {
//     if (!timelineState.current) return;
//     if (timelineState.current.isPlaying) {
//       timelineState.current.pause();
//     } else {
//       timelineState.current.play({ autoEnd: true });
//     }
//   };

//   const timeRender = (time: number) => {
//     const float = (parseInt((time % 1) * 100 + '') + '').padStart(2, '0');
//     const min = (parseInt(time / 60 + '') + '').padStart(2, '0');
//     const second = (parseInt((time % 60) + '') + '').padStart(2, '0');
//     return <>{`${min}:${second}.${float.replace('0.', '')}`}</>;
//   };

//   return (
//     // <div className="timeline-player">
//     //   <div className="play-control" onClick={handlePlayOrPause}>
//     //     {timelineStateRef && timelineStateRef.isPlaying ? 'Pause' : 'Play'}
//     //   </div>
//     //   <div className="time">{time.toFixed(2)}</div>
//     // </div>
//     <div className="timeline-player">
//     <div className="play-control" onClick={handlePlayOrPause}>
//       {isPlaying ? "playing" : "paused" }
//     </div>
//     <div className="time">{timeRender(time)}</div>
//     time
//   </div>
//   );
// };

// export default TimelinePlayer;
