import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./rehoboam.module.scss";
import { intervalExtent } from "../utils";

export function Rehoboam() {
  const { filteredByArea } = useContext(TweetsContext);
  const [svgPath, setSvgPath] = useState(null);

  const radius = 100;
  const margin = 20,
    width = 2 * radius,
    height = 2 * radius,
    svgWidth = width + 2 * margin,
    svgHeight = height + 2 * margin;

  useEffect(() => {
    if (!filteredByArea.length) {
      return;
    }

    console.log("Rehoboam/by area", filteredByArea);

    const interval = currentInterval(filteredByArea);
    const bins = interval.bins15;
    const extent = intervalExtent(interval);

    console.log("Rehoboam/extent", extent);

    const dateFormatter = d3.timeFormat("%I%p"); // https://github.com/d3/d3-time-format#locale_format

    // ==================

    const maxDisturbance = margin;
    const maxLength = d3.max(bins, ({ length }) => length);
    const [start, end] = extent;
    const radialData = bins.map(({ x0, length }) => {
      const fraction = (x0 - start) / (end - start);
      const radians = 2 * Math.PI * fraction;
      const disturbance = maxDisturbance * (length / maxLength);
      return [radians, radius + disturbance];
    });
    const path = d3.lineRadial()(radialData);
    console.log("Rehoboam/data", radialData);
    console.log("Rehoboam/path", path);

    setSvgPath(path);
  }, [filteredByArea]);

  if (!svgPath) {
    return null;
  }

  return (
    <div className={styles.container}>
      <svg className={styles.svg} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin + radius},${margin + radius})`}>
          <circle
            cx={0}
            cy={0}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth={1}
          />
          <path d={svgPath} fill="none" stroke="red" stroke-width="2" />
        </g>
      </svg>
    </div>
  );
}
