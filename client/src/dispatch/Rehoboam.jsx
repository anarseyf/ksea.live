import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import rehoboamStyles from "./rehoboam.module.scss";
import liveStyles from "./live.module.scss";
import { intervalExtent } from "../utils";
import { Topline } from "./Topline";

export function Rehoboam({ area }) {
  const { filteredByArea } = useContext(TweetsContext);
  const [svgPath, setSvgPath] = useState(null);
  const [live, setLive] = useState(null);

  const radius = 100;
  const margin = 30,
    width = 2 * radius,
    height = 2 * radius,
    svgWidth = width + 2 * margin,
    svgHeight = height + 2 * margin;

  useEffect(() => {
    if (!filteredByArea.length) {
      return;
    }

    console.log("Rehoboam/by area", filteredByArea);

    const current = currentInterval(filteredByArea);
    const bins = current.bins15;
    const extent = intervalExtent(current);

    console.log("Rehoboam/extent", extent);

    const dateFormatter = d3.timeFormat("%I%p"); // https://github.com/d3/d3-time-format#locale_format

    // ==================

    const maxDisturbance = margin;
    const maxLength = d3.max(bins, ({ length }) => length);
    const [start, end] = extent;

    const toRadial = (timestamp, length) => {
      const fraction = (timestamp - start) / (end - start);
      const radians = 2 * Math.PI * fraction;
      const disturbance = maxDisturbance * (length / maxLength);
      return [radians, radius + disturbance];
    };

    const radialData = bins.map(({ x0, length }) => toRadial(x0, length));

    const radialGen = d3.lineRadial().curve(d3.curveCardinal.tension(0.4));
    const path = radialGen(radialData);
    console.log("Rehoboam/data", radialData);
    // console.log("Rehoboam/path", path);

    setSvgPath(path);

    const now = +new Date();
    const lastBin = bins[bins.length - 1];
    const [theta, r] = toRadial(now, lastBin.length);
    setLive({
      cx: r * Math.sin(theta),
      cy: r * -Math.cos(theta),
      r: 5,
    });
  }, [filteredByArea]);

  if (!svgPath) {
    return null;
  }

  const total = currentInterval(filteredByArea).values.length;
  const text = area || "Seattle";

  return (
    <div className={rehoboamStyles.container}>
      <div className={rehoboamStyles.counter}>
        <Topline number={total} text={text} />
      </div>
      <svg className={rehoboamStyles.svg} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin + radius},${margin + radius})`}>
          <circle
            cx={0}
            cy={0}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth={1}
          />
          <path
            className={rehoboamStyles.line}
            d={svgPath}
            fill="none"
            stroke="red"
            stroke-width="3"
          />
          {live && (
            <g className={liveStyles.live}>
              <circle {...live} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
