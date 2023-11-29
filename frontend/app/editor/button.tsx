import React from 'react';
import styles from "./page.module.css";

interface ButtonProps {
  text: string;
  iconName: string;
  onClick: () => void;
}

const IconButton: React.FC<ButtonProps> = ({ text, iconName, onClick }) => {
  const buttonStyle: React.CSSProperties = {
    borderRadius: '20px',
    backgroundColor: 'var(--color-primary);', // Use your global primary color variable here
    color: 'white',
  };

  return (
    <button onClick={onClick} className={styles.button}>
      {/* <span className="icon">{iconName}</span> */}
      <span className="text">{text}</span>
    </button>
  );
};

export default IconButton;
