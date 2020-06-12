import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import { intervalExtent, isPhone } from "../utils";
import historyStyles from "./history.module.scss";
import svgStyles from "./svg.module.scss";

export const History = () => {
  const { historyForArea } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);

  const fill = "white";

  const svgWidth = isPhone ? 250 : 350,
    svgHeight = 800,
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
    const timeExtent = intervalExtent(interval, 60);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length)])
      .range([0, width]);

    const yScale = d3.scaleTime().domain(timeExtent).range([0, height]);

    const dateFormatter = d3.timeFormat("%-m/%-d"); // https://github.com/d3/d3-time-format#locale_format

    const yAxis = d3
      .axisLeft()
      .tickFormat(dateFormatter)
      .scale(yScale)
      .ticks(d3.timeMonth.every(1));
    d3.select(yAxisRef.current).call(yAxis);

    const xAxis = d3.axisTop().scale(xScale).ticks(2);
    d3.select(xAxisRef.current).call(xAxis);

    let temp = 0;
    if (bins.length) {
      const bin = bins[0];
      temp = Math.floor(xScale(bin.x1) - xScale(bin.x0));
    }
    const binWidth = 2; // Math.max(1, temp);

    const newSvgData = bins.map(({ x0, length }) => ({
      x: xScale(0),
      width: xScale(length),
      y: yScale(x0),
      height: binWidth,
      rx: 4,
    }));

    setSvgData(newSvgData);
  }, [historyForArea]);

  return (
    <div className={historyStyles.container}>
      <svg className={historyStyles.svg} width={svgWidth} height={svgHeight}>
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
};
