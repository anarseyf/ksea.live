import React from "react";
import styles from "./paragraph.module.scss";
import classnames from "classnames";

export const Paragraph = ({ h1, title, content, margin = false }) => {
  return (
    <div className={classnames(styles.paragraph, { [styles.margin]: margin })}>
      {h1 && <h1>{h1}</h1>}
      {title && <h3>{title}</h3>}
      {content && <div className={styles.text}>{content}</div>}
    </div>
  );
};
