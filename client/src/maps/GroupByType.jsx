import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

export function GroupByType() {
  const groupedby = GroupByOptions.IncidentType;
  const tweets = useContext(TweetsContext);

  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    console.log("BY TYPE/effect/tweets", tweets);
    const tweetsBy = groupBy(groupedby, tweets);

    console.log("BY TYPE/effect/tweets by type", tweetsBy);

    const newDatasets = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values),
      total: values.length,
    }));

    setDatasets(newDatasets);
  }, [tweets]);

  if (!datasets.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;
  console.log("BY TYPE/datasets", datasets);
  const extents = xyExtents(datasets.flat());

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {datasets.map((d) => (
        <MultiLine
          dataset={d}
          extents={extents}
          title={d.key}
          total={d.total}
        ></MultiLine>
      ))}
    </div>
  );
}
