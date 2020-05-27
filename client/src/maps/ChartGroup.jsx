import React, { useContext, useEffect, useState, useRef } from "react";
import { TweetsContext } from "./TweetsProvider";
import { histogram } from "../histogram";
import { byZip } from "../groupby";
import { MultiLine } from "./MultiLine";

export function ChartGroup() {
  const tweets = useContext(TweetsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsByZip = byZip(tweets);

    const withBins = tweetsByZip.map(({ values, ...rest }) => ({
      ...rest,
      values,
      bins: histogram(values),
    }));

    const mainDataset = withBins[0];
    const datasetGroups = withBins
      .slice(1, 5)
      .map((compareTo) => [mainDataset, compareTo]);

    setData(datasetGroups);
  }, [tweets]);

  console.log("GROUP render", data);

  return (
    <>
      {data.map((d) => (
        <MultiLine datasets={d} title={d[0].key} showTotal={false}></MultiLine>
      ))}
    </>
  );
}
