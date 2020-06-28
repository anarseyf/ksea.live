import React, { useContext, useEffect, useState } from "react";
import { timeFormatterMonthDay, pacificMidnight } from "../clientUtils";
import styles from "./topline.module.scss";
import { isPhone } from "../clientUtils";
import classnames from "classnames";
import { DataContext } from './DataProvider';

export const Topline = ({ total, text }) => {
  const { status } = useContext(DataContext);
  const isDefined = typeof total === "number";
  const totalContent = isDefined ? total : "⋯";
  const totalElement = <div className={styles.total}>{totalContent}</div>;
  const phone = isPhone();
  const [stale, setStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(<span>&nbsp;</span>);

  useEffect(() => {
    if (status.lastUpdated) {
      const date = new Date(status.lastUpdated);
      const midnight = pacificMidnight();
      setLastUpdated(timeFormatterMonthDay(+date));
      setStale(date < midnight);
    }
  }, [setLastUpdated, status]);
  

  return (
    <div className={classnames(styles.topline, {[styles.phone]: phone})}>
      {text && <div className={styles.text}>{text}</div>}
      {totalElement}
      <div className={classnames(styles.date, { [styles.stale]: stale })}>{lastUpdated}</div>
    </div>
  );
}
