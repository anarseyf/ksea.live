import React from "react";
import styles from "./topline.module.css";
export function Topline({ number = 0, text }) {
  return (
    <div className={styles.topline}>
      {text && <div className={styles.text}>{text}</div>}
      <div className={styles.number}>{number}</div>
    </div>
  );
}
