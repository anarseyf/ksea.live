import React from "react";
import styles from "./topline.module.scss";
export const Topline = ({ total, text }) => {
  return (
    <div className={styles.topline}>
      {text && <div className={styles.text}>{text}</div>}
      {typeof total === "number" && <div className={styles.total}>{total}</div>}
    </div>
  );
}
