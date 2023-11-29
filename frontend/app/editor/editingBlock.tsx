import React, { FC, useState, useEffect } from 'react';
import TextEditorField from './textfield';
import { timelineData, SubtitleTimeline, Block, selected } from './timelineData';
import styles from "./page.module.css";

interface TextEditorProps {
  selectedItemIndex: number;
  items: Block[];
  onUpdateText: (index: number, newText: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ selectedItemIndex, items, onUpdateText }) => {
  const [editedText, setEditedText] = useState(items[selectedItemIndex] ?  items[selectedItemIndex].text : "");
 

  useEffect(() => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length) {
      setEditedText(items[selectedItemIndex].text);
    }
  }, [selectedItemIndex, items]);

  const handleTextChange = (newText: string) => {
    setEditedText(newText);
    onUpdateText(selectedItemIndex, newText);
  };

  return (
    <div>
    <div className={styles['sideBarBoxInput']}>
        Text
      <TextEditorField  text={editedText} onTextChange={handleTextChange} />
    </div>
    </div>
  );
};

export default TextEditor;
