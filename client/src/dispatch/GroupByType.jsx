import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram, xyExtents } from "../histogram";
import { GroupByOptions, groupBy, DefaultInterval } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.scss";
import { key } from "vega";

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
  const [_, tweets] = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const groupedByType = groupBy(groupedby, tweets);

    const groupedByTime = groupedByType.map(({ values, ...rest }) => ({
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
