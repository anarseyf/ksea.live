import React, { useEffect, useState, useRef, useContext } from "react";
import classnames from "classnames";

import { scaleLinear as d3scaleLinear } from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { line as d3line, curveCardinal as d3curveCardinal } from "d3-shape";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";

import styles from "./punchcard.module.scss";
import svgStyles from "./svg.module.scss";
import { isPhone } from "../clientUtils";
import { DataContext } from "./DataProvider";

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const [circles, setCircles] = useState([]);

  const svgWidth = isPhone() ? 350 : 500;
  const svgHeight = 0.4 * svgWidth,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;
  const dayHeight = height / 7;
  const maxRadius = width / 24 / 2 - 1;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!punchCard.length) {
      return;
    }

    const xExtent = [0, 23];

    const max = d3max(punchCard.flat(2).map(({ avg }) => avg));
    const yExtent = [0, max * 7 * 2];

    const xScale = d3scaleLinear().domain(xExtent).range([0, width]);
    const xAxis = d3axisBottom().scale(xScale).tickSize(3);
    d3select(xAxisRef.current).call(xAxis);

    const yScale = d3scaleLinear().domain(yExtent).range([height, 0]);
    const yAxis = d3axisLeft().scale(yScale).tickValues([0, 1, 2, 3, 4, 5, 6]);
    d3select(yAxisRef.current).call(yAxis);

    const data = punchCard
      .map((day, iDay) =>
        day.map(({ avg }, iHour) => ({
          hour: iHour,
          day: iDay,
          value: avg,
        }))
      )
      .flat(2);

    const newCircles = data.map(({ hour, day, value }) => ({
      key: `${day}-${hour}`,
      cx: xScale(hour),
      cy: yScale(day) - day * dayHeight,
      r: maxRadius * Math.sqrt(value / max),
    }));

    setCircles(newCircles);
  }, [punchCard, height, width, maxRadius, dayHeight]);

  if (!punchCard.length) {
    return null;
  }

  return (
    <svg className={styles.svg} width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          className={svgStyles.axis}
          ref={xAxisRef}
          transform={`translate(0,${height})`}
        />
        <g className={svgStyles.axis} ref={yAxisRef} />
        <g transform={`translate(0,${-dayHeight / 2})`}>
          {circles.map(({ key, cx, cy, r }) => (
            <circle key={key} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      </g>
    </svg>
  );
};
