import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";

export const useLegend = () => {
  const tweets = useContext(TweetsContext);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const tweetsByType = groupBy(GroupByOptions.IncidentType, tweets);
    const legendByType = tweetsByType.map(({ key, color, values }) => ({
      key,
      color,
      total: values.length,
    }));
    const groupby = tweetsByType[0].groupby;
    const newSubLegend = { [groupby]: legendByType };
    setLegend({ ...legend, ...newSubLegend });
    console.warn("NEW LEGEND! (switch to useContext(LegendContext)?)");
  }, [tweets]);

  return [legend];
};
