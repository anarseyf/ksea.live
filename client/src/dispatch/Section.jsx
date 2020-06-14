import React from "react";
import styles from "./section.module.scss";

export const Section = ({ children, styleOption = 0, edgeToEdge = false }) => {
  const style =
    styleOption === 1
      ? styles.style1
      : styleOption === 2
      ? styles.style2
      : styleOption === 3
      ? styles.styleMap
      : styles.styleDefault;
  return (
    <section className={`${styles.section} ${style}`}>
      <div className={styles.content}>
        <div
          className={`${styles.subcontent} ${
            edgeToEdge ? styles.edgeToEdge : ""
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
