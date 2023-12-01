import { TimelineRow, TimelineAction } from '@xzdarcy/react-timeline-editor';

export interface Block extends TimelineAction {
    text: string;
}

export interface SubtitleTimeline extends TimelineRow {
    actions: Block[];    
}

export const selected: number = -1;

export const timelineData: SubtitleTimeline[] = [
    {id: "0",
    actions:[
        {
            id: "0",
            start: 0,
            end: 4,
            effectId: "effect0",
            text: "",
        },

    ]}
];
