import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import { axisRadialInner } from "d3-radial-axis";
import { DataContext, currentInterval } from "./DataProvider";
import { intervalExtent } from "../clientUtils";
import { Topline } from "./Topline";
import rehoboamStyles from "./rehoboam.module.scss";
import svgStyles from "./svg.module.scss";

export const Rehoboam = ({ area }) => {
  const { filteredByArea, activeOrMajorForArea } = useContext(DataContext);
  const [svgPath, setSvgPath] = useState(null);
  const [sev2Circles, setSev2Circles] = useState([]);
  const [total, setTotal] = useState(undefined);
  const axisRef = useRef(null);

  const mainRadius = 100;
  const margin = 30,
    width = 2 * mainRadius,
    height = 2 * mainRadius,
    svgWidth = width + 2 * margin,
    svgHeight = height + 2 * margin;

  const dotRadius = 5;

  useEffect(() => {
    if (!filteredByArea.length) {
      return;
    }

    setTotal(currentInterval(filteredByArea).total);

    const current = currentInterval(filteredByArea);
    // const bins = current.binsHiRes;
    const bins = current.bins;
    const extent = intervalExtent(current);
    const maxDisturbance = margin / 2;
    const maxLength = d3.max(bins, ({ length }) => length);
    const [start, end] = extent;

    const toRadial = (timestamp, length) => {
      const fraction = (timestamp - start) / (end - start);
      const radians = 2 * Math.PI * fraction;
      const disturbance = maxLength ? maxDisturbance * (length / maxLength) : 0;
      return [radians, mainRadius + disturbance];
    };

    const radialData = bins.map(({ x0, length }) => toRadial(x0, length));
    const radialGen = d3.lineRadial().curve(d3.curveCardinal.tension(0.4));
    const path = radialGen(radialData);
    setSvgPath(path);

    const angleScale = d3
      .scaleLinear()
      .domain(extent)
      .range([0, 2 * Math.PI]);
    const HOUR = 3600 * 1000;
    const dateFormatter = d3.timeFormat("%-I%p"); // https://github.com/d3/d3-time-format#locale_format
    const tickValues = [0, 6, 12, 18].map((h) => current.start + h * HOUR);
    const axis = axisRadialInner(angleScale, mainRadius)
      .tickFormat(dateFormatter)
      .tickSize(0)
      .tickValues(tickValues); // for some reason d3.timeHour.every() doesn't work here
    d3.select(axisRef.current).call(axis);

    if (activeOrMajorForArea.length) {
      const toRadialDot = (timestamp, index) => {
        const fraction = (timestamp - start) / (end - start);
        const radians = 2 * Math.PI * fraction;
        const offset = index * 2 * dotRadius;
        return [radians, mainRadius + offset];
      };

      const activeOrMajorBins = currentInterval(activeOrMajorForArea).bins;
      const toSev2Points = ({ x0, sev2 }) => {
        const stack = [...new Array(sev2)].map((_, i) => ({
          x0,
          index: i,
        }));
        return stack;
      };
      const sev2Data = activeOrMajorBins.flatMap(toSev2Points);
      const radialSev2Data = sev2Data.map(({ x0, index }) =>
        toRadialDot(x0, index)
      );

      const circles = radialSev2Data.map(([theta, r], i) => ({
        cx: r * Math.sin(theta),
        cy: r * -Math.cos(theta),
        r: dotRadius,
        key: `circle-${i}`
      }));

      console.log("REHO/circles",circles);

      setSev2Circles(circles);
    }
  }, [activeOrMajorForArea, filteredByArea]);

  const text = area || "Seattle";

  console.log("REHO/sev2Circles",sev2Circles.map(({key})=>key));

  return (
    <div className={rehoboamStyles.container}>
      <div className={rehoboamStyles.counter}>
        <Topline total={total} text={text} />
      </div>
      <svg className={rehoboamStyles.svg} width={svgWidth} height={svgHeight}>
        <g
          transform={`translate(${margin + mainRadius},${margin + mainRadius})`}
        >
          <g className={svgStyles.axis} ref={axisRef} />
          <circle
            className={rehoboamStyles.circle}
            cx={0}
            cy={0}
            r={mainRadius}
          />
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
          <g className={rehoboamStyles.dots}>
            {sev2Circles.map(({cx, cy, r, key}) => (
              <g key={key}>
                <circle className={rehoboamStyles.sev2inner} cx={cx} cy={cy} r={r}  />
                <circle className={rehoboamStyles.sev2outer} cx={cx} cy={cy} r={r+3} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
