import React, { useContext, useEffect, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions } from "../groupingOptions";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.scss";

export function GroupByType({ area, cumulative = false }) {
  // TODO - remove?
  const groupedby = GroupByOptions.IncidentType;
  const { groupedByType } = useContext(TweetsContext);
  const groupTitle = `> Group by ${groupedby}`;
  const [datasets, setDatasets] = useState([]);

  if (!groupedByType.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {datasets.map((d) => (
        <MultiLine
          intervals={d.intervals}
          showCumulative={cumulative}
          // extents={extents}
          title={d.key}
        ></MultiLine>
      ))}
    </div>
  );
}
