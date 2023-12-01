import React from 'react';
import styles from "./page.module.css";

interface ButtonProps {
  text: string;
  Icon: React.ElementType; 
  onClick: () => void;
}

const IconButton: React.FC<ButtonProps> = ({ text, Icon, onClick }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {Icon && <Icon />}
      <div className={styles.buttontext}>
      <h3>{text}</h3>
      </div>
    </button>
  );
};

export default IconButton;
