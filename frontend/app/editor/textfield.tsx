import React from 'react';
import styles from "./page.module.css";

interface TextEditorFieldProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const TextEditorField: React.FC<TextEditorFieldProps> = ({ text, onTextChange }) => {
  // const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onTextChange(event.target.value);
  // };
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };
  return (
    // <input type="text" value={text} onChange={handleTextChange} className={styles['sideBarBoxFieldInput']}/>
    <textarea value={text} onChange={handleTextareaChange} className={styles['sideBarBoxFieldInput']}></textarea>

  );
};

export default TextEditorField;
