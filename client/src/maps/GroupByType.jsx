import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

export function GroupByType({ cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const tweets = useContext(TweetsContext);

  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const tweetsBy = groupBy(groupedby, tweets);

    const newDatasets = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values, { cumulative }),
      total: values.length,
    }));

    const byTime = groupBy(GroupByOptions.TimeInterval, newDatasets[0].values);
    console.log("GROUP BY/byTime [0]", byTime);

    setDatasets(newDatasets);
  }, [tweets]);

  if (!datasets.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;
  console.log("BY TYPE/datasets", datasets);
  // const extents = xyExtents(datasets.flat());

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {datasets.map((d) => (
        <MultiLine
          datasets={[d]}
          // extents={extents}
          title={d.key}
          total={d.total}
        ></MultiLine>
      ))}
    </div>
  );
}
