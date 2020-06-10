import React, { useEffect, useState, useRef, useContext } from "react";
import { TypeLegend } from "./TypeLegend";
import { useLegend } from "./useLegend";
import { GroupByOptions } from "../groupingOptions";

export const LegendSection = () => {
  const [legend] = useLegend();
  const [typeLegend, setTypeLegend] = useState([]);

  useEffect(() => {
    const option = GroupByOptions.IncidentType;
    legend && legend[option] && setTypeLegend(legend[option]);
  }, [legend]);

  if (!typeLegend.length) {
    return null;
  }

  return <TypeLegend legend={typeLegend} showLabels={true} />;
};
