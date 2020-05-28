import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./chart.module.css";
import { xyExtents } from "../histogram";

export function MultiLine({ datasets = [], title, total, extents }) {
  const [svgData, setSvgData] = useState([]);

  const svgWidth = 160,
    svgHeight = 80,
    margin = { top: 10, right: 10, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!datasets.length) {
      return;
    }

    const { xExtent, yExtent } = extents || xyExtents(datasets);

    const dateFormatter = d3.timeFormat("%H:%M"); // "(%b %d) %H:%M"

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3.timeHour.every(12));
    d3.select(xAxisRef.current).call(xAxis);

    const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);
    const yAxis = d3.axisLeft().scale(yScale).ticks(2);
    d3.select(yAxisRef.current).call(yAxis);

    const line = d3
      .line()
      .x((d) => xScale(d.x0))
      .y((d) => yScale(d.length));

    const paths = datasets.map((d) => d.bins).map(line);

    setSvgData(
      paths.map((path) => ({
        path,
      }))
    );
  }, [datasets]);

  return (
    <div className={styles.container}>
      <div>
        {title && <div className={styles.title}>{title}</div>}
        {typeof total === "number" && (
          <div className={styles.total}>{total}</div>
        )}
      </div>
      <svg className={styles.chart} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {svgData.map((d, i) => (
            <path
              d={d.path}
              stroke={i ? "deepskyblue" : "orangered"}
              strokeWidth={i ? 1 : 3}
              fill="none"
            ></path>
          ))}
        </g>
        <g
          ref={xAxisRef}
          transform={`translate(${margin.left},${margin.top + height})`}
        />
        <g
          ref={yAxisRef}
          transform={`translate(${margin.left},${margin.top})`}
        />
      </svg>
    </div>
  );
}
