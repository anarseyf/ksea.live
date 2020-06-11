import React from "react";
import styles from "./section.module.scss";

export const Section = ({ children, styleOption = 1 }) => {
  const style =
    styleOption === 1
      ? styles.style1
      : styleOption === 2
      ? styles.style2
      : styles.styleDefault;
  return (
    <div className={`${styles.section} ${style}`}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
