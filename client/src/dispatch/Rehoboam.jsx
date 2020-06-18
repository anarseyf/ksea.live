import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import { axisRadialInner } from "d3-radial-axis";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import { intervalExtent } from "../clientUtils";
import { Topline } from "./Topline";
import rehoboamStyles from "./rehoboam.module.scss";
import svgStyles from "./svg.module.scss";

export const Rehoboam = ({ area }) => {
  const { filteredByArea } = useContext(TweetsContext);
  const [svgPath, setSvgPath] = useState(null);
  const [live, setLive] = useState(null);
  const [sev2Circles, setSev2Circles] = useState([]);
  const axisRef = useRef(null);

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

    const current = currentInterval(filteredByArea);
    console.log("Rehoboam/current", current);
    // const bins = current.binsHiRes;
    const bins = current.bins;
    const extent = intervalExtent(current);

    console.log("Rehoboam/extent", extent);

    const dateFormatter = d3.timeFormat("%-I%p"); // https://github.com/d3/d3-time-format#locale_format

    // ==================

    const maxDisturbance = margin;
    const maxLength = d3.max(bins, ({ length }) => length);
    const [start, end] = extent;

    const toRadial = (timestamp, length) => {
      const fraction = (timestamp - start) / (end - start);
      const radians = 2 * Math.PI * fraction;
      const disturbance = maxLength ? maxDisturbance * (length / maxLength) : 0;
      return [radians, radius + disturbance];
    };

    const radialData = bins.map(({ x0, length }) => toRadial(x0, length));

    const radialGen = d3.lineRadial().curve(d3.curveCardinal.tension(0.4));
    const path = radialGen(radialData);

    setSvgPath(path);

    const lastBin = bins[bins.length - 1];
    const [theta, r] = toRadial(lastBin.x0, lastBin.length);
    setLive({
      cx: r * Math.sin(theta),
      cy: r * -Math.cos(theta),
      r: 5,
    });

    const angleScale = d3
      .scaleLinear()
      .domain(extent)
      .range([0, 2 * Math.PI]);
    const HOUR = 3600 * 1000;
    const tickValues = [0, 12].map((h) => current.start + h * HOUR);
    const axis = axisRadialInner(angleScale, radius)
      .tickFormat(dateFormatter)
      .tickSize(0)
      .tickValues(tickValues); // for some reason d3.timeHour.every() doesn't work here
    d3.select(axisRef.current).call(axis);

    const toSev2Points = ({ x0, sev2 }) => {
      const stack = [...new Array(sev2)].map((_, i) => ({
        x0,
        index: i + 1,
      }));
      return stack;
    };
    const sev2Data = bins.flatMap(toSev2Points);
    console.log("REHOBOAM/sev2 data", sev2Data);
    const radialSev2Data = sev2Data.map(({ x0, index }) => toRadial(x0, index));

    const circles = radialSev2Data.map(([theta, r]) => ({
      cx: r * Math.sin(theta),
      cy: r * -Math.cos(theta),
      r: 5,
    }));

    setSev2Circles(circles);
  }, [filteredByArea]);

  const total = filteredByArea.length
    ? currentInterval(filteredByArea).total
    : 0;
  const text = area || "Seattle";

  console.log("REHOBOAM/render");

  return (
    <div className={rehoboamStyles.container}>
      <div className={rehoboamStyles.counter}>
        <Topline number={total} text={text} />
      </div>
      <svg className={rehoboamStyles.svg} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin + radius},${margin + radius})`}>
          <g className={svgStyles.axis} ref={axisRef} />
          <circle className={rehoboamStyles.circle} cx={0} cy={0} r={radius} />
          {svgPath && (
            <path
              className={classnames(
                svgStyles.path,
                svgStyles.highlight,
                rehoboamStyles.path
              )}
              d={svgPath}
            />
          )}
          {live && (
            <g className={svgStyles.live}>
              <circle {...live} />
            </g>
          )}
          <g>
            {sev2Circles.map((c) => (
              <>
                <circle className={rehoboamStyles.sev2} {...c} />
                <circle {...c} r={c.r + 3} fill="none" stroke="white" />
              </>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
