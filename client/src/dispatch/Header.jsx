import React, { useEffect, useState, useRef, useContext } from "react";
import { TypeLegend } from "./TypeLegend";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import { useLegend } from "./useLegend";
import { Histogram } from "./Histogram";
import { GroupByOptions } from "../groupingOptions";
import { MultiLine } from "./MultiLine";

export const Header = ({ area }) => {
  const { filteredByArea } = useContext(TweetsContext);
  const [legend] = useLegend();
  const [typeLegend, setTypeLegend] = useState([]);

  useEffect(() => {
    const option = GroupByOptions.IncidentType;
    legend && legend[option] && setTypeLegend(legend[option]);
  }, [legend]);

  if (!filteredByArea.length) {
    return null;
  }

  return (
    <div>
      <MultiLine intervals={filteredByArea[0].intervals} useCumulative={true} />
      {typeLegend && <TypeLegend legend={typeLegend} showLabels={true} />}
      <Histogram />
    </div>
  );
};
