import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { axisRadialInner } from "d3-radial-axis";
import { DataContext, currentInterval } from "./DataProvider";
import { intervalExtent } from "../clientUtils";
import { Topline } from "./Topline";
import classnames from "classnames";
import styles from "./rehoboam.module.scss";
import svgStyles from "./svg.module.scss";

export const Rehoboam = ({ area }) => {
  const { filteredByAreaMin, activeOrMajorForArea } = useContext(DataContext);
  const [svgPath, setSvgPath] = useState(null);
  const [circles, setCircles] = useState([]);
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
    if (!filteredByAreaMin.length) {
      return;
    }

    setTotal(currentInterval(filteredByAreaMin).total); // TODO - use status

    const current = currentInterval(filteredByAreaMin);
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
      const toRadialDot = ({ derived: { timestamp } }) => {
        const fraction = (timestamp - start) / (end - start);
        const radians = 2 * Math.PI * fraction;
        return [radians, mainRadius];
      };

      const activeOrMajorValues = currentInterval(activeOrMajorForArea).values;

      const radialDots = activeOrMajorValues.map(toRadialDot);

      const newCircles = radialDots.map(([theta, r], i) => {
        const {
          derived: { severity, active },
        } = activeOrMajorValues[i];
        return {
          key: i,
          cx: r * Math.sin(theta),
          cy: r * -Math.cos(theta),
          r: dotRadius,
          sev1: severity >= 1,
          sev2: severity >= 2,
          active,
        };
      });

      setCircles(newCircles);
    }
  }, [activeOrMajorForArea, filteredByAreaMin]);

  const text = area || "Seattle";

  return (
    <div className={styles.container}>
      <div className={styles.counter}>
        <Topline total={total} text={text} />
      </div>
      <svg className={styles.svg} width={svgWidth} height={svgHeight}>
        <g
          transform={`translate(${margin + mainRadius},${margin + mainRadius})`}
        >
          <g className={svgStyles.axis} ref={axisRef} />
          <circle className={styles.maincircle} cx={0} cy={0} r={mainRadius} />
          {svgPath && <path className={classnames(styles.path)} d={svgPath} />}
          <g className={styles.events}>
            {circles.map(({ key, cx, cy, r, sev1, sev2, active }) => (
              <g key={key} className={classnames({ [styles.active]: active })}>
                <circle
                  className={classnames(styles.eventcircle)}
                  cx={cx}
                  cy={cy}
                  r={r}
                />
                {sev1 && (
                  <circle className={styles.major} cx={cx} cy={cy} r={r + 2} />
                )}
                {sev2 && (
                  <circle className={styles.major} cx={cx} cy={cy} r={r + 4} />
                )}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
