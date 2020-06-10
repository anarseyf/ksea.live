import React, { useEffect, useContext, useState } from "react";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions } from "../groupingOptions";

const legendByType = (groups) => {
  // console.log("TODO useLegend/groups", groups);
  const legendByType = groups.map(({ key, color, intervals }) => {
    return {
      key,
      color,
      total: intervals[0].total,
    };
  });
  return { [GroupByOptions.IncidentType]: legendByType };
};

export const useLegend = () => {
  const { groupedByType } = useContext(TweetsContext);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (!groupedByType.length) {
      return;
    }
    const sublegend = legendByType(groupedByType);
    console.warn("useLegend/setting main - TODO convert to context");

    const newLegend = { ...legend, ...sublegend };
    console.log("new legend:", newLegend);
    setLegend(newLegend);
  }, [groupedByType]);

  return [legend];
};
