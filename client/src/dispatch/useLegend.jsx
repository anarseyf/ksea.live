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
  const { groupedByType, groupedByAreaByType } = useContext(TweetsContext);
  const [legend, setLegend] = useState({});
  const [legendsByArea, setLegendsByArea] = useState({});

  useEffect(() => {
    if (!groupedByType.length) {
      return;
    }
    const sublegend = legendByType(groupedByType);
    console.log("useLegend/main:", sublegend);
    setLegend({ ...sublegend });
  }, [groupedByType]);

  useEffect(() => {
    if (!groupedByAreaByType.length) {
      return;
    }

    const legends = {};
    groupedByAreaByType.forEach(({ key: area, groups }) => {
      legends[area] = legendByType(groups);
    });
    setLegendsByArea(legends);
  }, [groupedByAreaByType]);

  return [legend, legendsByArea];
};
