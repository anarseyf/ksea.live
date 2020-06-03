import React, { useContext, useEffect, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram } from "../histogram";
import { GroupByOptions } from "../groupingOptions";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.scss";

export function GroupByType({ area, cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const { groupedByType, groupedByAreaByType } = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const dataset = area
      ? (groupedByAreaByType.find(({ key }) => key === area) || {}).groups
      : groupedByType;

    if (!dataset || !dataset.length) {
      return;
    }

    console.log("BY TYPE/dataset", dataset);

    const { start, end } = dataset[0].intervals[0];
    const extent = [start, end];

    const addHistograms = ({ key, values, ...rest }) => ({
      key,
      values,
      ...rest,
      bins: histogram(values, {
        cumulative,
        extent,
      }),
    });

    const addBins = ({ intervals, ...rest }) => ({
      ...rest,
      intervals: intervals.map(addHistograms),
    });

    let result = dataset.map(addBins);
    console.log("BY TYPE/result", result);
    setDatasets(result);
  }, [groupedByType, groupedByAreaByType]);

  if (!datasets.length) {
    return null;
  }

  console.log("GROUP BY TYPE/render");

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
