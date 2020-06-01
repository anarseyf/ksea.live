import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import styles from "./chart.module.scss";
import { expand } from "../histogram";

export function MultiLine({ dataset = [], title }) {
  const [svgData, setSvgData] = useState([]);

  const svgWidth = 150,
    svgHeight = 80,
    margin = { top: 10, right: 10, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!dataset.length) {
      return;
    }

    const firstLineBins = dataset[0].bins;
    const xExtentActual = [
      firstLineBins[0].x0,
      firstLineBins[firstLineBins.length - 1].x1,
    ];
    const xExtent = expand(xExtentActual);

    const yExtent = [
      0,
      d3.max([
        1.0,
        ...dataset.flatMap(({ bins }) => bins).map(({ length }) => length),
      ]),
    ];

    const dateFormatter = d3.timeFormat("%I%p"); // https://github.com/d3/d3-time-format#locale_format

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3.timeHour.every(6));
    d3.select(xAxisRef.current).call(xAxis);

    const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);
    const yAxis = d3.axisLeft().scale(yScale).ticks(2);
    d3.select(yAxisRef.current).call(yAxis);

    const line = d3
      .line()
      .x((d) => xScale(d.x0))
      .y((d) => yScale(d.length));

    const paths = dataset.map((d) => d.bins).map(line);

    setSvgData(
      paths.map((path) => ({
        path,
      }))
    );
  }, [dataset]);

  if (!dataset.length) {
    return null;
  }

  const total = dataset[0].values.length;

  return (
    <div className={styles.container}>
      <div>
        {title && <div className={styles.title}>{title}</div>}
        {typeof total === "number" && (
          <div className={styles.total}>{total}</div>
        )}
      </div>
      <svg className={styles.chart} width={svgWidth} height={svgHeight}>
        <g
          className={styles.axis}
          ref={xAxisRef}
          transform={`translate(${margin.left},${margin.top + height})`}
        />
        <g
          className={styles.axis}
          ref={yAxisRef}
          transform={`translate(${margin.left},${margin.top})`}
        />
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
      </svg>
    </div>
  );
}
