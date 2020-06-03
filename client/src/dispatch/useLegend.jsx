import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions } from "../groupingOptions";

const legendByType = (tweetsByType) => {
  // console.log("TODO useLegend/tweets", tweetsByType);
  const legendByType = tweetsByType.map(({ key, color, intervals }) => {
    return {
      key,
      color,
      total: intervals[0].values.length,
    };
  });
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
    // console.log("TODO useLegend/sub", groupedByType);
    const sublegend = legendByType(groupedByType);
    console.warn("useLegend/setting main - TODO convert to context");
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
    console.warn("useLegend/setting legendsByArea - TODO convert to context");
    setLegendsByArea(legends);
  }, [groupedByAreaByType]);

  return [legend, legendsByArea];
};
