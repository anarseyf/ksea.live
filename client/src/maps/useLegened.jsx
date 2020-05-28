import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { byType } from "../groupby";

export const useLegend = () => {
  const tweets = useContext(TweetsContext);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const tweetsByType = byType(tweets);
    console.log("LEGEND/tweetsByType", tweetsByType);
    const legendByType = tweetsByType.map(({ key, color, values }) => ({
      key,
      color,
      total: values.length,
    }));
    const groupby = tweetsByType[0].groupby;
    const newSubLegend = { [groupby]: legendByType };
    setLegend({ ...legend, ...newSubLegend });
  }, [tweets]);

  return [legend];
};
