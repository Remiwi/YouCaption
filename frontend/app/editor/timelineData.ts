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
//   {
//     id: "0",
//     actions: [
//       {
//         id: "action0",
//         start: 0,
//         end: 2,
//         effectId: "effect0",
//         text: "fart",
//       },
//       {
//         id: "action1",
//         start: 4,
//         end: 8,
//         effectId: "action01",
//         text: "pooop",
//       },
//     ],
//   },
];
