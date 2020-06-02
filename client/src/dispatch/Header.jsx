import React, { useEffect, useState, useRef, useContext } from "react";
import { Topline } from "./Topline";
import { TypeLegend } from "./TypeLegend";
import { TweetsContext } from "./TweetsProvider";
import { useLegend } from "./useLegend";
import { Histogram } from "./Histogram";
import { GroupByOptions } from "../groupby";

export function Header({ area }) {
  const [_, tweets] = useContext(TweetsContext);
  const [legend] = useLegend();

  return (
    <div>
      <Topline number={tweets.length} text={area} />
      <TypeLegend
        legend={legend[GroupByOptions.IncidentType]}
        showLabels={true}
      />
      <Histogram />
    </div>
  );
}
