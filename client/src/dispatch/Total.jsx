import React from "react";
import styles from "./total.module.scss";

export const Total = ({ total = 0 }) => {
  return <div className={styles.container}>{total}</div>;
};
