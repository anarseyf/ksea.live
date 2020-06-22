import React from "react";
import { timeFormatterMonthDay } from "../clientUtils";
import styles from "./topline.module.scss";
import { isPhone } from "../clientUtils";
import classnames from "classnames";

export const Topline = ({ total, text }) => {
  const isDefined = typeof total === "number";
  const totalContent = isDefined ? total : "⋯";
  const totalElement = <div className={styles.total}>{totalContent}</div>;
  const phone = isPhone();

  return (
    <div className={classnames(styles.topline, {[styles.phone]: phone})}>
      {text && <div className={styles.text}>{text}</div>}
      {totalElement}
      <div className={styles.date}>{timeFormatterMonthDay(new Date())}</div>
    </div>
  );
}
