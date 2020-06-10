import React from "react";
import styles from "./paragraph.module.scss";

export const Paragraph = ({ text = "" }) => {
  return <div className={styles.paragraph}>{text}</div>;
};
