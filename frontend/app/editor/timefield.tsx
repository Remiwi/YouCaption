import React, { FC, useState, useEffect } from 'react';
import { timelineData, SubtitleTimeline, Block, selected } from './timelineData';
import styles from "./page.module.css";



interface TimeDisplayItemProps {
    label: string;
    time: number;
}


const TimeDisplayItem: React.FC<TimeDisplayItemProps> = ({ label, time }) => {
    return (
        <div className={styles['sideBarBoxDisplay']}>
            {label}
            <p className={styles['sideBarBoxField']}>
                {time}
            </p>
        </div>
        );
  

};

interface TimeDisplayProps {
    selectedItemIndex: number;
    items: Block[];
  }
  
const TimeDisplayFields: FC<TimeDisplayProps> = ({ selectedItemIndex, items }) => {
    // const [editedText, setEditedText] = useState(items[selectedItemIndex] ?  items[selectedItemIndex].text : "");
    const [startTime, setStartTime] = useState(items[selectedItemIndex] ?  items[selectedItemIndex].start : 0);
    const [endTime, setEndTime] = useState(items[selectedItemIndex] ?  items[selectedItemIndex].start : 4);
  
  
    // useEffect(() => {
    //   if (selectedItemIndex >= 0 && selectedItemIndex < items.length) {
    //     setEditedText(items[selectedItemIndex].text);
    //   }
    // }, [selectedItemIndex, items]);
  
    return (
        <div> 
            <TimeDisplayItem label={"Start Time"} time={startTime} />
            <TimeDisplayItem label={"End Time"} time={startTime} />
        </div>
    );
  };
  
  export default TimeDisplayFields;
  