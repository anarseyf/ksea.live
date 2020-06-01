import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";

export const legendByType = (tweets = []) => {
  const groupedby = GroupByOptions.IncidentType;
  const tweetsByType = groupBy(groupedby, tweets);
  const legendByType = tweetsByType.map(({ key, color, values }) => ({
    key,
    color,
    total: values.length,
  }));
  const sublegend = { [groupedby]: legendByType };
  return sublegend;
};

export const useLegend = () => {
  const tweets = useContext(TweetsContext);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (!tweets.length) {
      return;
    }

    setLegend({ ...legend, ...legendByType(tweets) });
    console.warn("NEW LEGEND! (switch to useContext(LegendContext)?)");
  }, [tweets]);

  return legend;
};
