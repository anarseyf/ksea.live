import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";
import styles from "./chart.module.css";
import { TypeLegend } from "./TypeLegend";
import { legendByType } from "./useLegend";
import * as d3 from "d3";

export function GroupByArea() {
  const groupedby = GroupByOptions.ZipCode;
  const [tweets] = useContext(TweetsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsBy = groupBy(groupedby, tweets);

    const newData = tweetsBy
      .map(({ values, ...rest }) => ({
        ...rest,
        values,
        total: values.length,
        legend: legendByType(values),
      }))
      .sort((a, b) => d3.descending(a.total, b.total));

    setData(newData);
  }, [tweets]);

  if (!data.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {data.map(({ legend, key: title, total }) => (
        <TypeLegend {...{ legend, title, total }} />
      ))}
    </div>
  );
}
