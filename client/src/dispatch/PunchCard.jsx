import React, { useEffect, useState, useRef, useContext } from "react";

import {
  scaleLinear as d3scaleLinear,
  scaleOrdinal as d3scaleOrdinal,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";

import styles from "./punchcard.module.scss";
import svgStyles from "./svg.module.scss";
import { isPhone } from "../clientUtils";
import { DataContext } from "./DataProvider";

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const [rects, setRects] = useState([]);

  const svgWidth = isPhone() ? 350 : 500;
  const margin = { top: 20, right: 30, bottom: 20, left: 30 };
  const width = svgWidth - margin.left - margin.right;
  const daySize = width / 24;
  const gap = 1;
  const rectSize = daySize - 2 * gap;
  const height = daySize * 7;
  const svgHeight = height + margin.top + margin.bottom;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!punchCard.length) {
      return;
    }

    const xExtent = [0, 24];

    const max = d3max(punchCard.flat(2).map(({ avg }) => avg));

    const xScale = d3scaleLinear().domain(xExtent).range([0, width]);
    const xAxis = d3axisBottom().scale(xScale).tickSize(3);
    d3select(xAxisRef.current).call(xAxis);

    const yDomain = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const yRange = yDomain.map((_, i) => i * daySize);
    const yScale = d3scaleOrdinal(yDomain, yRange);
    const yAxis = d3axisLeft().scale(yScale).ticks(7);
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

    const newRects = data.map(({ hour, day, value }) => ({
      key: `${day}-${hour}`,
      x: xScale(hour) + gap,
      y: day * daySize,
      width: rectSize - gap,
      height: rectSize - gap,
      density: value >= (2 / 3) * max ? 3 : value >= (1 / 3) * max ? 2 : 1,
    }));

    setRects(newRects);
  }, [punchCard, height, width, rectSize, daySize]);

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
        <g transform={`translate(0,${-rectSize / 2})`}>
          {rects.map(({ key, x, y, width, height }) => (
            <rect key={key} x={x} y={y} width={width} height={height} />
          ))}
        </g>
      </g>
    </svg>
  );
};
