import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext, currentInterval } from "./DataProvider";
import {
  intervalExtent,
  timeFormatterHourAM,
  every6Hours,
  isPhone,
} from "../clientUtils";
import { Topline } from "./Topline";
import classnames from "classnames";

import {
  scaleLinear as d3scaleLinear,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { lineRadial as d3lineRadial, curveCardinal as d3curveCardinal } from "d3-shape";
import { axisRadialInner } from "d3-radial-axis";

import styles from "./rehoboam.module.scss";
import svgStyles from "./svg.module.scss";

export const Rehoboam = ({ area }) => {
  const { filteredByAreaMin, activeOrMajorForArea } = useContext(DataContext);
  const [svgPath, setSvgPath] = useState(null);
  const [circles, setCircles] = useState([]);
  const [total, setTotal] = useState(undefined);
  const axisRef = useRef(null);

  const mainRadius = isPhone() ? 100 : 130;
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
    const bins = current.binsHiRes;
    const extent = intervalExtent(current);
    const maxDisturbance = 20;
    const maxLength = d3max(bins, ({ length }) => length);
    const [start, end] = extent;

    const toRadial = (timestamp, length) => {
      const fraction = (timestamp - start) / (end - start);
      const radians = 2 * Math.PI * fraction;
      const disturbance = maxLength ? maxDisturbance * (length / maxLength) : 0;
      return [radians, mainRadius + disturbance];
    };

    const radialData = bins.map(({ x0, length }) => toRadial(x0, length));
    const radialGen = d3lineRadial().curve(d3curveCardinal.tension(0.4));
    const path = radialGen(radialData);
    setSvgPath(path);

    const angleScale = d3scaleLinear()
      .domain(extent)
      .range([0, 2 * Math.PI]);

    const axis = axisRadialInner(angleScale, mainRadius)
      .tickFormat(timeFormatterHourAM)
      .tickSize(0)
      .tickValues(every6Hours(current.start));
    d3select(axisRef.current).call(axis);

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
  }, [activeOrMajorForArea, filteredByAreaMin, mainRadius]);

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
          <circle className={styles.maincircle} cx={0} cy={0} r={mainRadius} />
          <g className={styles.axis} ref={axisRef} />
          {svgPath && <path className={classnames(styles.path)} d={svgPath} />}
          <g className={styles.events}>
            {circles.map(({ key, cx, cy, r, sev1, sev2, active }) => (
              <g key={key} className={classnames({ [svgStyles.live]: active })}>
                <circle
                  className={classnames(svgStyles.event)}
                  cx={cx}
                  cy={cy}
                  r={r}
                />
                {sev1 && (
                  <circle className={classnames(styles.outer, svgStyles.outer)} cx={cx} cy={cy} r={r + 3} />
                )}
                {sev2 && (
                  <circle className={classnames(styles.outer, svgStyles.outer)} cx={cx} cy={cy} r={r + 6} />
                )}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
