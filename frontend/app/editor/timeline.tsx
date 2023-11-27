import { Timeline, TimelineEffect, TimelineState, TimelineEngine } from '@xzdarcy/react-timeline-editor';
import React, { useState, useRef } from 'react';
import styles from "./page.module.css"
import { CustomRender0 } from './custom';
import { timelineData, SubtitleTimeline, Block, selected } from './timelineData';
import TextEditor from './editingBlock';
import TimelinePlayer from './timelineplayer';

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

  };
  const engine = new TimelineEngine();  
  engine.setTime(600);
  const idRef = useRef (0);
  


  const handleAddAction = (row: SubtitleTimeline, time: number) => {
    idRef.current++;
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
        minStart:row.actions[row.actions.length-1].end
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
    // TODO: write back to db that i added a new elem
}

  const adjustMinMaxTime = (index: number) => {
    const startTime = data[0].actions[index].start;
    const endTime = data[0].actions[index].end;
    if (index-1 >= 0) {
      data[0].actions[index-1].maxEnd = startTime;
    }
    if (index-1 < data[0].actions.length-2) {
      data[0].actions[index+1].minStart = endTime;
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
    // TODO: prob should do some callback to db here but its structured bad so i shall deal with this...later
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
    
{/* button */}
    <button
    onClick={() => {
      let lastItemEnd = 0
      if  (data.length) {
        lastItemEnd = data[data.length - 1]?.actions[data[data.length - 1]?.actions.length - 1]?.end;
      }
      handleAddAction(data[0], lastItemEnd);
      
    }}
  >
    +
  </button>
  </div>




  {/* <button
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

        // onDoubleClickRow={(e, {row, time}) => {
        //   console.log(row);
        //   handleAddAction(row as SubtitleTimeline, time);          
        // }}
        
        onActionResizeEnd={ (params) => {
          const { action, row, start, end, dir } = params;
          const foundIndex = data[0].actions.findIndex((item) => item.id === action.id);
          adjustMinMaxTime(foundIndex);
        }}


        onClickAction={ (e, {action, row, time}) => {
          const foundIndex = data[0].actions.findIndex((item) => item.id === action.id);
          console.log(foundIndex);
          setBlockID(foundIndex); 
          adjustMinMaxTime(foundIndex);
          // TODO: write back to db the time of associated block in backend (each block in arr in backend should have index that is same as front end)

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