import styles from "./page.module.css";
import {useState} from 'react';


interface SideBarProps {
    label: string;
    time: number;
    type: 'display' | 'input';
}


const SideBarItem: React.FC<SideBarProps> = ({ label, time, type }) => {
    

  
    if (type == 'display') {
        return (
            <div className={styles['sideBarBoxDisplay']}>
              {label}
              <p className={styles['sideBarBoxField']}>
                  {time}
              </p>
            </div>
          );
    } else {
        return (
            <div className={styles['sideBarBoxInput']}>
              {label}
              <textarea className={styles['sideBarBoxFieldInput']}/>
            </div>
        );
    }

};
 export default SideBarItem;