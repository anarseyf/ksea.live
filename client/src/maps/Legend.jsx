import React, { useEffect, useState, useContext } from "react";
import { byIncidentType } from "../groupby";
import { TweetsContext } from "./TweetsProvider";
import { useLegend } from "./useLegend";

const size = 12;

export function Legend() {
  const [legend] = useLegend();
  const subLegend = legend.type;

  useEffect(() => {
    console.log("NEW LEGEND:", legend);
  }, [legend]);

  if (!subLegend) {
    return null;
  }
  return subLegend.map((d) => (
    <div>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={d.color || "white"}
        ></circle>
      </svg>
      <span>
        {d.key}: {d.total}
      </span>
    </div>
  ));
}
