import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import {
  TweetsContext,
  currentInterval,
  previousInterval,
} from "./TweetsProvider";
import { intervalExtent, isPhone } from "../utils";
import historyStyles from "./history.module.scss";
import svgStyles from "./svg.module.scss";

export const History = () => {
  const { historyForArea } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);

  const binHeight = 2;
  const svgWidth = isPhone ? 200 : 300,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    svgHeight = 366 * (binHeight + 1) + margin.top + margin.bottom,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;
  const yearWidth = width / 2;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!historyForArea.length) {
      return;
    }

    const intervalCurrent = currentInterval(historyForArea);
    const intervalPrevious = previousInterval(historyForArea);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const timeExtent = intervalExtent(intervalCurrent, 60);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(binsCurrent, (b) => b.length)])
      .range([0, yearWidth]);

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

    // let temp = 0;
    // if (binsCurrent.length) {
    //   const bin = binsCurrent[0];
    //   temp = Math.floor(xScale(bin.x1) - xScale(bin.x0));
    // }
    // const binHeight = Math.max(1, temp);

    const currentYear = binsCurrent.map(({ x0, length }) => ({
      x: yearWidth + xScale(0),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 4,
    }));
    const previousYear = binsPrevious.map(({ x0, length }) => ({
      x: yearWidth + xScale(0) - xScale(length),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 4,
    }));
    setSvgData([currentYear, previousYear]);
  }, [historyForArea]);

  return (
    <div className={historyStyles.container}>
      <svg className={historyStyles.svg} width={svgWidth} height={svgHeight}>
        <g
          className={svgStyles.axis}
          ref={xAxisRef}
          transform={`translate(${margin.left + yearWidth},${
            margin.top + height
          })`}
        />
        <g
          className={svgStyles.axis}
          ref={yAxisRef}
          transform={`translate(${margin.left + yearWidth},${margin.top})`}
        />
        <g transform={`translate(${margin.left},${margin.top})`}>
          {svgData.map((dataset, iDataset) =>
            dataset.map((d) => (
              <rect
                x={d.x}
                y={d.y}
                width={d.width}
                height={d.height}
                rx={d.rx}
                fill={iDataset ? "white" : "red"}
              ></rect>
            ))
          )}
        </g>
      </svg>
    </div>
  );
};
