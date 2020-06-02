import React, { useContext, useEffect, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram } from "../histogram";
import {
  GroupByOptions,
  DefaultInterval,
  groupBy,
  computeOffsets,
} from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.scss";

export function GroupByType({ area, cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const { groupedByType, groupedByAreaByType } = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const dataset = area
      ? (groupedByAreaByType.find(({ key }) => key === area) || {}).groups
      : groupedByType;

    if (!dataset || !dataset.length) {
      return;
    }

    const groupedByTime = dataset.map(({ values, ...rest }) => ({
      ...rest,
      groups: groupBy(GroupByOptions.TimeInterval, values),
    }));

    const withOffsets = groupedByTime.map(computeOffsets);

    const start = +withOffsets[0].groups[0].key;
    const extent = [start, start + DefaultInterval];

    const addHistograms = ({ key, values, ...rest }) => ({
      key,
      values,
      ...rest,
      bins: histogram(values, {
        cumulative,
        extent,
      }),
    });

    const datasetToBins = ({ groups, ...rest }) => ({
      ...rest,
      groups: groups.map(addHistograms),
    });

    let result = withOffsets.map(datasetToBins);

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
          dataset={d.groups}
          // extents={extents}
          title={d.key}
        ></MultiLine>
      ))}
    </div>
  );
}
