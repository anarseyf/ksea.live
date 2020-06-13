import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import { intervalExtent, isPhone } from "../clientUtils";
import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";

export function Histogram() {
  const { historyForArea } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);

  const fill = "white";

  const svgWidth = isPhone ? 250 : 350,
    svgHeight = 80,
    margin = { top: 10, right: 10, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!historyForArea.length) {
      return;
    }

    const interval = currentInterval(historyForArea);
    const bins = interval.binsLowRes;
    const extent = intervalExtent(interval, 60);
    const xScale = d3.scaleTime().domain(extent).range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length)])
      .range([height, 0]);

    const dateFormatter = d3.timeFormat("%-m/%-d"); // https://github.com/d3/d3-time-format#locale_format

    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3.timeMonth.every(1));
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
      x: xScale(x0),
      width: binWidth,
      y: yScale(length),
      height: yScale(0) - yScale(length),
      rx: 4,
    }));

    setSvgData(newSvgData);
  }, [historyForArea]);

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
              fill={fill}
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
}
