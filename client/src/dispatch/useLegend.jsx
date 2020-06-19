import React, { useEffect, useContext, useState } from "react";
import { DataContext } from "./DataProvider";
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
  const { byTypeForArea } = useContext(DataContext);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (!byTypeForArea.length) {
      return;
    }
    const sublegend = legendByType(byTypeForArea);
    console.warn("useLegend/setting main - TODO convert to context");

    const newLegend = { ...legend, ...sublegend };
    console.log("new legend:", newLegend);
    setLegend(newLegend);
  }, [byTypeForArea, legend]);

  return [legend];
};
