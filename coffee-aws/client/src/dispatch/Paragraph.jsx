import React from "react";
import styles from "./paragraph.module.scss";
import classnames from "classnames";

export const Paragraph = ({ title = "", content = "", margin = false }) => {
  return (
    <div className={classnames(styles.paragraph, { [styles.margin]: margin })}>
      {title && <h3>{title}</h3>}
      <div className={styles.text}>{content}</div>
    </div>
  );
};
