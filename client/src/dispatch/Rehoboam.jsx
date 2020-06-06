import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./rehoboam.module.scss";
import { intervalExtent } from "../utils";

export function Rehoboam() {
  const { filteredByArea } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);

  const fill = "white";

  const svgWidth = 400,
    svgHeight = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!filteredByArea.length) {
      return;
    }

    console.log("Rehoboam/by area", filteredByArea);

    const interval = currentInterval(filteredByArea);
    const bins = interval.bins;
    const extent = intervalExtent(interval);
    const xScale = d3.scaleTime().domain(extent).range([0, width]);

    console.log("Rehoboam/extent", extent);

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

    // ==================

    const radial = () => {
      const maxRadius = width / 2;
      const arcScale = d3
        .scaleLinear()
        .domain([minTemp, maxTemp])
        .range([maxRadius * 0.25, maxRadius]);

      const startAngleFn = (i) => 2 * Math.PI * (i / data.length);
      const endAngleFn = (i) => startAngleFn(i + 1);

      const arcFn = (d, i) =>
        d3
          .arc()
          .innerRadius(arcScale(d.low))
          .outerRadius(arcScale(d.high))
          .cornerRadius(4)
          .startAngle(startAngleFn(i))
          .endAngle(endAngleFn(i));

      return data.map((d, i) => ({
        path: arcFn(d, i)(),
        fill: colorScale(d.avg),
      }));
    };

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
