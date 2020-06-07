import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";
import { intervalExtent } from "../utils";

export function MultiLine({
  intervals = [],
  title,
  showHeader = false,
  useCumulative,
}) {
  const [svgData, setSvgData] = useState([]);
  const [live, setLive] = useState(null);

  const svgWidth = 150,
    svgHeight = 80,
    margin = { top: 10, right: 20, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const accessor = ({ length, cumulative }) =>
    useCumulative ? cumulative : length;

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!intervals.length) {
      return;
    }

    const xExtent = intervalExtent(intervals[0]);

    const yExtent = [
      0,
      d3.max([1.0, ...intervals.flatMap(({ bins }) => bins).map(accessor)]),
    ];

    const dateFormatter = d3.timeFormat("%-I%p"); // https:/github.com/d3/d3-time-format#locale_format

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .tickSize(3)
      .scale(xScale)
      .ticks(d3.timeHour.every(12));
    d3.select(xAxisRef.current).call(xAxis);

    const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);
    const yAxis = d3.axisLeft().scale(yScale).ticks(2);
    d3.select(yAxisRef.current).call(yAxis);

    const line = d3
      .line()
      .curve(d3.curveCardinal.tension(0.3))
      .x((d) => xScale(d.x0))
      .y((d) => yScale(accessor(d)));

    const paths = intervals.map((d) => d.bins).map(line);

    setSvgData(
      paths.map((path) => ({
        path,
      }))
    );

    const now = +new Date();
    const bins = intervals[0].bins;
    setLive({
      cx: xScale(now),
      cy: yScale(bins[bins.length - 1].cumulative),
      r: 4,
    });
  }, [intervals]);

  if (!intervals.length) {
    return null;
  }

  const total = intervals[0].values.length;

  return (
    <div className={chartStyles.container}>
      {showHeader && (
        <div className={chartStyles.header}>
          {title && <div className={chartStyles.title}>{title}</div>}
          {typeof total === "number" && (
            <div className={chartStyles.total}>{total}</div>
          )}
        </div>
      )}
      <svg className={chartStyles.chart} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className={svgStyles.axis}
            ref={xAxisRef}
            transform={`translate(0,${height})`}
          />
          <g className={svgStyles.axis} ref={yAxisRef} />
          <g>
            {svgData.map((d, i) => (
              <path
                className={`${svgStyles.path} ${i ? "" : svgStyles.highlight}`}
                d={d.path}
              />
            ))}
          </g>
          {live && (
            <g className={svgStyles.live}>
              <circle {...live} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
