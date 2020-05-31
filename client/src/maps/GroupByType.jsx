import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

const computeOffsets = ({ groups, ...rest }) => {
  // console.log("WITH OFFSETS/dataset", dataset);
  let offsetFn = (start) => 0;
  if (groups.length && groups[0].groupby === GroupByOptions.TimeInterval) {
    const start0 = +groups[0].key;
    offsetFn = (start) => start0 - start;
  }

  const offsetGroups = groups.map(({ key, ...group }) => ({
    key,
    ...group,
    offset: offsetFn(+key),
  }));

  const valueMapper = ({ derived: { timestamp }, ...restValue }, offset) => ({
    ...restValue,
    derived: {
      timestamp,
      offset,
    },
  });

  console.log(">> >> computing offsets", offsetGroups);

  return {
    ...rest,
    groups: offsetGroups.map(({ offset, values, ...restGroup }) => ({
      offset,
      ...restGroup,
      values: values.map((v) => valueMapper(v, offset)),
    })),
  };
};

export function GroupByType({ cumulative = false }) {
  const groupedby = GroupByOptions.IncidentType;
  const tweets = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const groupedByType = groupBy(groupedby, tweets);

    console.log("GROUP BY/byType", groupedByType);

    const groupedByTime = groupedByType.map(({ values, ...rest }) => {
      const groupedByTime = groupBy(GroupByOptions.TimeInterval, values);
      console.log("> > groups by time", groupedByTime);
      return {
        ...rest,
        groups: groupedByTime,
      };
    });

    console.log("GROUP BY/byTime", groupedByTime);
    const withOffsets = groupedByTime.map(computeOffsets);

    console.log("GROUP BY/withOffsets", withOffsets);

    const addHistograms = ({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values, { cumulative }),
    });

    const datasetToBins = ({ groups, ...rest }) => ({
      ...rest,
      groups: groups.map(addHistograms),
    });

    const result = withOffsets.map(datasetToBins);

    console.log("GROUP BY/result", result);

    setDatasets(result);
  }, [tweets]);

  if (!datasets.length) {
    return null;
  }

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
