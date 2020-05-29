import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import styles from "./chart.module.css";
import { TypeLegend } from "./TypeLegend";
import { legendByType } from "./useLegend";

export function GroupByArea({}) {
  const groupedby = GroupByOptions.ZipCode;
  const tweets = useContext(TweetsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsBy = groupBy(groupedby, tweets);

    const newData = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      total: values.length,
      legend: legendByType(values),
    }));

    setData(newData);
  }, [tweets]);

  if (!data.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {data.map(({ legend, key: title, total }) => (
        <TypeLegend {...{ legend, title, total }} />
      ))}
    </div>
  );
}
