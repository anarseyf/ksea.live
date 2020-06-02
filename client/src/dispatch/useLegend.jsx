import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";

const legendByType = (tweetsByType) => {
  const legendByType = tweetsByType.map(({ key, color, values }) => ({
    key,
    color,
    total: values.length,
  }));
  return { [GroupByOptions.IncidentType]: legendByType };
};

export const useLegend = () => {
  const [_, _2, tweetsByType, tweetsByAreaByType] = useContext(TweetsContext);
  const [legend, setLegend] = useState({});
  const [legendsByArea, setLegendsByArea] = useState({});

  useEffect(() => {
    if (!tweetsByType.length) {
      return;
    }
    const sublegend = legendByType(tweetsByType);
    console.log("useLegend/main:", sublegend);
    setLegend({ ...sublegend });
  }, [tweetsByType]);

  useEffect(() => {
    if (!tweetsByAreaByType.length) {
      return;
    }

    const legends = {};
    tweetsByAreaByType.forEach(({ key: area, groups }) => {
      legends[area] = legendByType(groups);
    });
    console.log("useLegend/by area:", legends);
    setLegendsByArea(legends);
  }, [tweetsByAreaByType]);

  return [legend, legendsByArea];
};
