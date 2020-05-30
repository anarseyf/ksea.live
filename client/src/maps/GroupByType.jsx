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

    let newDatasets = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      // bins: histogram(values, { cumulative }),
      total: values.length,
    }));

    console.log("GROUP BY/before", newDatasets);
    newDatasets = newDatasets.map(({ values }) => {
      const byTime = groupBy(GroupByOptions.TimeInterval, values);
      return byTime.map(({ key, values }) => ({
        key,
        values,
        bins: histogram(values, { cumulative }),
      }));
    });

    console.log("GROUP BY/after", newDatasets);

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
          dataset={d}
          // extents={extents}
          title={d.key}
          total={-1}
        ></MultiLine>
      ))}
    </div>
  );
}
