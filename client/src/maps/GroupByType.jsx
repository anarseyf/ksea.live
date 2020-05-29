import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

export function GroupByType({ cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const tweets = useContext(TweetsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsBy = groupBy(groupedby, tweets);

    const withBins = tweetsBy.map(({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values, { cumulative }),
      total: values.length,
    }));

    setData(withBins);
  }, [tweets]);

  if (!data.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;
  const extents = xyExtents(data.flat());

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {data.map((d) => (
        <MultiLine
          datasets={[d]}
          extents={extents}
          title={d.key}
          total={d.total}
        ></MultiLine>
      ))}
    </div>
  );
}
