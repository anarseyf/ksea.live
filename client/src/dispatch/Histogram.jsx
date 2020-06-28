import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext, currentInterval } from "./DataProvider";
import { intervalExtent, getContentWidth } from "../clientUtils";

import {
  scaleLinear as d3scaleLinear,
  scaleTime as d3scaleTime,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";
import { timeMonth as d3timeMonth } from "d3-time";
import { timeFormat as d3timeFormat } from "d3-time-format";

import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";

export const Histogram = () => {
  const { history } = useContext(DataContext);
  const [svgData, setSvgData] = useState([]);

  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    setContentWidth(getContentWidth());
  }, []);


  const svgWidth = contentWidth,
    svgHeight = 80,
    margin = { top: 20, right: 20, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!history.length) {
      return;
    }

    const interval = currentInterval(history);
    const bins = interval.binsLowRes;
    const extent = intervalExtent(interval, 60);
    const xScale = d3scaleTime().domain(extent).range([0, width]);

    const yScale = d3scaleLinear()
      .domain([0, d3max(bins, (b) => b.length)])
      .range([height, 0]);

    const dateFormatter = d3timeFormat("%-m/%-d"); // https://github.com/d3/d3-time-format#locale_format

    const xAxis = d3axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3timeMonth.every(1));
    d3select(xAxisRef.current).call(xAxis);

    const yAxis = d3axisLeft().scale(yScale).ticks(2);
    d3select(yAxisRef.current).call(yAxis);

    let temp = 0;
    if (bins.length) {
      const bin = bins[0];
      temp = Math.floor(xScale(bin.x1) - xScale(bin.x0));
    }
    const binWidth = Math.max(1, temp);

    const newSvgData = bins.map(({ x0, length }) => ({
      x: xScale(x0),
      width: binWidth,
      y: yScale(length),
      height: yScale(0) - yScale(length),
      rx: 4,
    }));

    setSvgData(newSvgData);
  }, [height, history, width]);

  return (
    <div className={chartStyles.container}>
      <svg className={chartStyles.svg} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {svgData.map((d) => (
            <rect
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              rx={d.rx}
            ></rect>
          ))}
        </g>
        <g
          className={svgStyles.axis}
          ref={xAxisRef}
          transform={`translate(${margin.left},${margin.top + height})`}
        />
        <g
          className={svgStyles.axis}
          ref={yAxisRef}
          transform={`translate(${margin.left},${margin.top})`}
        />
      </svg>
    </div>
  );
};
