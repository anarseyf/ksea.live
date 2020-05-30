import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

const withOffsets = (dataset = []) => {
  console.log("WITH OFFSETS/dataset", dataset);
  let offsetFn = (timestamp) => timestamp;
  if (dataset.length && dataset[0].groupby === GroupByOptions.TimeInterval) {
    const start0 = +dataset[0].key;
    offsetFn = (timestamp, start) => timestamp + (start - start0);
  }

  const tweetMapper = ({ derived: { timestamp }, ...rest }, start) => ({
    ...rest,
    derived: {
      timestamp,
      offset: offsetFn(timestamp, start),
    },
  });

  return dataset.map(({ key, values, ...rest }) => ({
    key,
    values: values.map((tweet) => tweetMapper(tweet, +key)),
    ...rest,
  }));
};

export function GroupByType({ cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const tweets = useContext(TweetsContext);

  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const tweetsBy = groupBy(groupedby, tweets);

    let withTotals = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      // bins: histogram(values, { cumulative }),
      total: values.length,
    }));

    const offsetDatasets = withOffsets(withTotals);

    console.log("GROUP BY/withOffsets", offsetDatasets);

    const result = withTotals.map(({ values }) => {
      const byTime = groupBy(GroupByOptions.TimeInterval, values);
      return byTime.map(({ key, values }) => ({
        groupby: GroupByOptions.TimeInterval,
        key,
        values,
        bins: histogram(values, { cumulative }),
      }));
    });

    console.log("GROUP BY/result", result);

    setDatasets(result);
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
