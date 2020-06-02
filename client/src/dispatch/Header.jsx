import React, { useEffect, useState, useRef, useContext } from "react";
import { Topline } from "./Topline";
import { TypeLegend } from "./TypeLegend";
import { TweetsContext } from "./TweetsProvider";
import { useLegend } from "./useLegend";
import { Histogram } from "./Histogram";
import { GroupByOptions } from "../groupby";

export const Header = ({ area }) => {
  const { filteredByArea } = useContext(TweetsContext);
  const [mainLegend, legendsByArea] = useLegend();
  const [legend, setLegend] = useState([]);

  useEffect(() => {
    const lgnd = area ? legendsByArea[area] : mainLegend;
    const option = GroupByOptions.IncidentType;
    lgnd && lgnd[option] && setLegend(lgnd[option]);
  }, [mainLegend, legendsByArea]);

  return (
    <div>
      <Topline number={filteredByArea.length} text={area || "Seattle"} />
      {/* {legend && <TypeLegend legend={legend} showLabels={true} />} */}
      {/* <Histogram /> */}
    </div>
  );
};
