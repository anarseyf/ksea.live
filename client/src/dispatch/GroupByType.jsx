import React, { useContext, useEffect, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions } from "../groupingOptions";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.scss";

export function GroupByType({ area, cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const { groupedByType, groupedByAreaByType } = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const datasets = area
      ? (groupedByAreaByType.find(({ key }) => key === area) || {}).groups
      : groupedByType;

    if (!datasets || !datasets.length) {
      return;
    }

    setDatasets(datasets);
  }, [groupedByType, groupedByAreaByType]);

  if (!datasets.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {datasets.map((d) => (
        <MultiLine
          intervals={d.intervals}
          // extents={extents}
          title={d.key}
        ></MultiLine>
      ))}
    </div>
  );
}
