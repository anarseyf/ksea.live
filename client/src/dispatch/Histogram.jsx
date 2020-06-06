import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./chart.module.scss";
import { intervalExtent } from "../utils";

export function Histogram() {
  const { filteredByArea } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);

  const fill = "white";

  const svgWidth = 200,
    svgHeight = 80,
    margin = { top: 10, right: 10, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!filteredByArea.length) {
      return;
    }

    console.log("HISTOGRAM/by area", filteredByArea);

    const interval = currentInterval(filteredByArea);
    const bins = interval.bins;
    const extent = intervalExtent(interval);
    const xScale = d3.scaleTime().domain(extent).range([0, width]);

    console.log("HISTOGRAM/extent", extent);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length)])
      .range([height, 0]);

    const dateFormatter = d3.timeFormat("%I%p"); // https://github.com/d3/d3-time-format#locale_format

    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3.timeHour.every(6));
    d3.select(xAxisRef.current).call(xAxis);

    const yAxis = d3.axisLeft().scale(yScale).ticks(2);
    d3.select(yAxisRef.current).call(yAxis);

    let temp = 0;
    if (bins.length) {
      const bin = bins[0];
      temp = Math.floor(xScale(bin.x1) - xScale(bin.x0));
    }
    const binWidth = Math.max(1, temp);

    const newSvgData = bins.map(({ x0, length }) => ({
      x: xScale(x0) - binWidth / 2,
      width: binWidth,
      y: yScale(length),
      height: yScale(0) - yScale(length),
      rx: binWidth / 4,
    }));

    setSvgData(newSvgData);
  }, [filteredByArea]);

  return (
    <div className={styles.container}>
      <svg className={styles.smallchart} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {svgData.map((d) => (
            <rect
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              rx={d.rx}
              fill={fill}
            ></rect>
          ))}
        </g>
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
      </svg>
    </div>
  );
}
