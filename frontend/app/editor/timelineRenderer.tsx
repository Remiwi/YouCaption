import React, { FC } from 'react';
import {SubtitleTimeline, Block } from './timelineData';
import styles from "./page.module.css";

const effect0TextStyle = {
    fontSize: '16px',
};

export const TimelineRenderer: FC<{ action: Block; row: SubtitleTimeline, selectedId: number }> = ({ action, row, selectedId }) => {
    const numberId = parseInt(action.id, 10);
    const isSelected = numberId === selectedId;
    const blockStyle = isSelected ? { border: '2px solid yellow' } : {};

    return (
    <div className={styles.timeline_block} style={blockStyle}>
    <div style={effect0TextStyle} className={`effect0-text`}>{`${action.text} ${(
        action.end - action.start
      ).toFixed(2)}s`}</div>


    </div>
  );
};
