import { Timeline, TimelineEffect, TimelineState, TimelineEngine } from '@xzdarcy/react-timeline-editor';
import React, { useState, useRef, useEffect } from 'react';
import styles from "./page.module.css"
import { FaRegTrashAlt, FaRegPlusSquare } from "react-icons/fa";
import { CustomRender0 } from './custom';
import { timelineData, SubtitleTimeline, Block, selected } from './timelineData';
import TextEditor from './editingBlock';
import TimelinePlayer from './timelineplayer';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGetWithBody, fetchPost,fetchPostJSON } from "@/utilities/myFetch";

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "res0",
  },
  effect1: {
    id: "effect1",
    name: "res1",
  },
};

const CustomScale = (props: {scale: number}) => {
  const {scale} = props;
  const min = parseInt(scale / 60 + '');
  const second = parseInt((scale % 60 + '').padStart(2, '0'));

  return <>{`${min}:${second}`}</>
}

interface CaptionData {
  startTime: number;
  endTime: number;
  text: string;
}


type TimelineEditorProps = {
  newTime: number;
  onTimeChange: (newTime: number) => void;
  newVideoState: boolean;
  onVideoStateChange: (newVideoState: boolean) => void;
  fullDuration: number;

};

const TimelineEditor: React.FC<TimelineEditorProps>  = ({ newTime, onTimeChange, newVideoState, onVideoStateChange, fullDuration})  => {
  const [data, setData] = useState(timelineData);
  const [blockID, setBlockID] = useState(selected);
  const timelineState = useRef<TimelineState>();

  const purpleBoxStyle = {
    height: '200px', 
    width: '100%',  
    marginBottom: '30px',
    paddingRight:'50px'

  }
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData();
        const array = JSON.parse(data);
        if (Array.isArray(array)) {
          setData((prevData) => {
            prevData[0].actions = array;
            idRef.current = array.length-1;
            return prevData;
          });
          for (let index = 0; index < data.length; index++) {
            adjustMinMaxTime(index, true);
          }
        }
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };
  
    getData();
  }, []); 

  async function fetchData() {
    try {
      const response = await fetchGetWithBody('http://127.0.0.1:8000/editor/userExistingTimeline/');
      const data = await response.json(); 
      console.log('Success:', data);
      return data; 
    } catch (error) {
      alert(error);
    }
  }
  
  const addCaptionMutation = useMutation({
    mutationKey: ['addCaption'],
    mutationFn: (captionData: CaptionData) => fetchPostJSON('http://127.0.0.1:8000/editor/addNewBlock/', {
      body: JSON.stringify({
        startTime: captionData.startTime,
        endTime: captionData.endTime,
        text: captionData.text
      })
    }),
    onSuccess: (data) => {
      console.log('Caption added successfully:', data);
    },
    onError: (error) => {
      console.error('Error adding caption:', error);
    },
  });

  const editCaptionMutation = useMutation({
    mutationKey: ['editCaption'],
    mutationFn: (captionData: CaptionData) => fetchPostJSON('http://127.0.0.1:8000/editor/editExistingBlock/', {
      body: JSON.stringify({
        startTime: captionData.startTime,
        endTime: captionData.endTime,
        text: captionData.text,
        blockID: blockID
      })
    }),
    onSuccess: (data) => {
      console.log('Caption added successfully:', data);
    },
    onError: (error) => {
      console.error('Error adding caption:', error);
    },
  });

  const deleteBlockMutation = useMutation({
    mutationKey: ['deleteCaption'],
    mutationFn: () => fetchPostJSON('http://127.0.0.1:8000/editor/deleteBlock/'),
    onSuccess: (data) => {
      console.log('Caption deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Error deleting caption', error);
    },
  });
  
  const engine = new TimelineEngine();  
  engine.setTime(600);
  const idRef = useRef (0);
  
  const handleAddAction = (row: SubtitleTimeline, time: number) => {
    idRef.current++;
    let minStart = 0;
    if (row && row.actions.length > 0) {
      minStart = row.actions[row.actions.length-1].end;
    }
    setData((pre) => {
      let rowIndex = 0;
      if (row) {
        rowIndex = pre.findIndex((item) => item.id === row.id);
      } else {
        rowIndex = 0;
      }
      
      const newAction: Block = {
        id: `${idRef.current}`,
        start: time,
        end: time + 4,
        effectId: "effect0",
        text: "",
        minStart:minStart
      };

      if (row) {
        pre[rowIndex] = { ...row, actions: [...row.actions, newAction] };
      } else {
        const newRowIndex = pre.length;
        const newRow: SubtitleTimeline = {
          id: `row${idRef.current}`,
          actions: [newAction],
        };
        pre[newRowIndex] = newRow;
      }

      return [...pre];
    });
    console.log(data);
    const captionData = {
      startTime: time,
      endTime: time+4,
      text: ""
    };
    addCaptionMutation.mutate(captionData);
}
  const handleDeleteAction = () => {
    if (data[0].actions.length === 0) {
      return;
    }
    idRef.current--;
    setData((prevData) => {
      const rowIndex = 0;
      const newActions = [...prevData[rowIndex].actions]; //make copy of actions 
      if (newActions.length > 0) {
        newActions.pop();
      }
      const updatedRow = { ...prevData[rowIndex], actions: newActions };  // create copy of the row with the updated actions
      const newData = [...prevData]; // make new array with the updated row
      newData[rowIndex] = updatedRow;
      console.log(newData);
      return newData;
    });
    deleteBlockMutation.mutate();
  };
  
  const adjustMinMaxTime = (index: number, firstMount: boolean) => {
    const startTime = data[0].actions[index].start;
    const endTime = data[0].actions[index].end;
    if (index-1 >= 0) {
      data[0].actions[index-1].maxEnd = startTime;
    }
    if (index-1 < data[0].actions.length-2) {
      data[0].actions[index+1].minStart = endTime;
    } 
    if (!firstMount) { // need this b/c w/o it, it will overwrite the last elem's stuff in backend 
      const captionData = {
        startTime: startTime,
        endTime: endTime,
        text: data[0].actions[index].text,
        blockID: index
      };
      editCaptionMutation.mutate(captionData, {
        onSuccess: () => {
          console.log("Caption adjusted successfully ");
        },
        onError: (error) => {
          console.log("Error adding caption ");
        }
      });
    }
  }

  const onUpdateText = (index: number, newText: string) => {
    const updatedItems = [...data[0].actions];
    updatedItems[index].text = newText;
    setData((prevData) => {
      const newData = [...prevData];
      newData[0].actions = updatedItems;
      return newData;
    });
    const captionData = {
      startTime: updatedItems[index].start,
      endTime: updatedItems[index].end,
      text: newText,
      blockID: blockID
    };
    editCaptionMutation.mutate(captionData, {
      onSuccess: () => {
        console.log("Caption added successfully ");
      },
      onError: (error) => {
        console.log("Error adding caption ");
      }
    });
  };

  const autoScrollWhenPlay = useRef<boolean>(false);

  const timeRender = (time: number) => {
    const hours = (parseInt(time / 3600 + '') + '').padStart(2, '0');
    const min = (parseInt((time % 3600) / 60 + '') + '').padStart(2, '0');
    const second = (parseInt(time % 60 + '') + '').padStart(2, '0');
    return <>{`${hours}:${min}:${second}`}</>;
  };


  return (
    <div>
      <TimelinePlayer timelineState={timelineState} autoScrollWhenPlay={autoScrollWhenPlay}  newTime={newTime} onTimeChange={onTimeChange} newVideoState={newVideoState} onVideoStateChange={onVideoStateChange} />

      <div className={styles.textBox}>
        <TextEditor
        selectedItemIndex={blockID >= 0 ? blockID : -1} // If blockID < 0, set selectedItemIndex to -1
        items={blockID >= 0 && data[0] && data[0].actions ? data[0].actions : []} // If conditions are false, set items to an empty array
        onUpdateText={onUpdateText}
      />
      </div>

  <div className={styles.timelineBar}>
    <div className={styles.timelineBarTime}>
    <h2>{timeRender(newTime)}</h2>
    </div>
    <div className={styles.timelineBarIcons}> 
    <button
    onClick={() => {
      if (data[0].actions.length === 0) {
        return;
      } else {
        handleDeleteAction();
      }
    }}
    >
      <FaRegTrashAlt/>
    </button>
    </div>
    <div className={styles.timelineBarIcons}>
    <button
      onClick={() => {
        if (data[0].actions.length === 0) {
          handleAddAction(data[0], 0);
        } else {
          let lastItemEnd = 0
          if  (data.length) {
            lastItemEnd = data[data.length - 1]?.actions[data[data.length - 1]?.actions.length - 1]?.end;
          }
          handleAddAction(data[0], lastItemEnd);
        }

        
      }}
    >
      <FaRegPlusSquare/>
    </button>
    </div>
  

  </div>



{/* 
  <button
    onClick={() => {
      if (data) {
        console.log(data);
      }
    }}
  >
  print data
  </button> */}


    <div className={styles.timeline}>
      <Timeline
        ref={timelineState}
        editorData={data}
        onChange={(data) => {
          setData(data as SubtitleTimeline[]);
        }}
        // effects={mockEffect}
        hideCursor={false}
        autoScroll={true}
        style={purpleBoxStyle}
        startLeft={40}
        rowHeight={50}
        engine={engine}
        
        // action = each indiv block
        // row is the colleciton of blocks (our array of blocks essentially)
        getActionRender={(action, row) => {
          return <CustomRender0 action={action as Block} row={row as SubtitleTimeline} selectedId={blockID}/>
        }}
        onActionResizeEnd={ (params) => {
          const { action, row, start, end, dir } = params;
          const foundIndex = data[0].actions.findIndex((item) => item.id === action.id);
          console.log(foundIndex);
          setBlockID(foundIndex); 
          adjustMinMaxTime(foundIndex, false);
        }}

        onActionMoveEnd={ (params) => {
          const { action, row, start, end } = params;
          const foundIndex = data[0].actions.findIndex((item) => item.id === action.id);
          console.log(foundIndex);
          setBlockID(foundIndex); 
          adjustMinMaxTime(foundIndex, false);
        }}

        onClickAction={ (e, {action, row, time}) => {
          const foundIndex = data[0].actions.findIndex((item) => item.id === action.id);
          console.log(foundIndex);
          setBlockID(foundIndex); 
          // removed adjustMinMaxTime here because it'd glitch and overwrite its surroundings stuff 
        }}
  
        // y = 20*num_scale (y is seconds, the visual will be min and seconds)
        scale={fullDuration/20}
        scaleSplitCount={10}
        getScaleRender={(scale) => <CustomScale scale={scale}/>}
      />
      
    </div>

    </div>
    
  );
};

export default TimelineEditor;