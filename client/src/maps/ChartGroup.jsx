import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram } from "../histogram";
import { byZip } from "../groupby";
import { MultiLine } from "./MultiLine";
import styles from "./chart.module.css";

export function ChartGroup({ cumulative = false }) {
  const tweets = useContext(TweetsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsByZip = byZip(tweets);

    const withBins = tweetsByZip.map(({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values, { cumulative }),
    }));

    const mainDataset = withBins[0];
    const datasetGroups = withBins
      .slice(1, 5)
      .map((compareTo) => [mainDataset, compareTo]);

    setData(datasetGroups);
  }, [tweets]);

  if (!data.length) {
    return null;
  }

  const groupTitle = `${data[0][0].key} compared to:`;
  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {data.map((d) => (
        <MultiLine datasets={d} title={d[1].key} showTotal={false}></MultiLine>
      ))}
    </div>
  );
}
