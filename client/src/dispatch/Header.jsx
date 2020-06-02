import React, { useEffect, useState, useRef, useContext } from "react";
import { Topline } from "./Topline";
import { TypeLegend } from "./TypeLegend";
import { TweetsContext } from "./TweetsProvider";
import { useLegend } from "./useLegend";
import { Histogram } from "./Histogram";
import { GroupByOptions } from "../groupby";

export function Header({ area }) {
  const [_, tweets] = useContext(TweetsContext);
  const [mainLegend, legendsByArea] = useLegend();

  const [legend, setLegend] = useState([]);

  useEffect(() => {
    const lgnd = area ? legendsByArea[area] : mainLegend;
    const option = GroupByOptions.IncidentType;
    lgnd && lgnd[option] && setLegend(lgnd[option]);
  }, [mainLegend, legendsByArea]);

  if (!legend) {
    return null;
  }

  return (
    <div>
      <Topline number={tweets.length} text={area} />
      <TypeLegend legend={legend} showLabels={true} />
      <Histogram />
    </div>
  );
}
