import React, { useEffect, useState, useRef, useContext } from "react";
import classnames from "classnames";

import { scaleLinear as d3scaleLinear } from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { line as d3line, curveCardinal as d3curveCardinal } from "d3-shape";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";

import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";
import { isPhone } from "../clientUtils";
import { DataContext } from "./DataProvider";

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const [svgData, setSvgData] = useState({ paths: [], flipPaths: [] });

  const svgWidth = isPhone() ? 350 : 500;
  const svgHeight = 0.5 * svgWidth,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;
  const dayHeight = height / 7;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!punchCard.length) {
      return;
    }

    const xExtent = [0, 71];

    const max = d3max(punchCard.flat(2).map(({ avg }) => avg));
    const yExtent = [0, max * 7 * 2];

    const xScale = d3scaleLinear().domain(xExtent).range([0, width]);
    const xAxis = d3axisBottom()
      .scale(xScale)
      .tickValues([0, 11, 23])
      .tickSize(3);
    d3select(xAxisRef.current).call(xAxis);

    const yScale = d3scaleLinear().domain(yExtent).range([height, 0]);
    const yAxis = d3axisLeft().scale(yScale).ticks(2);
    d3select(yAxisRef.current).call(yAxis);

    const line = d3line()
      .curve(d3curveCardinal.tension(0.3))
      .x((_, i) => xScale(i))
      .y((d) => yScale(d));
    const flipLine = d3line()
      .curve(d3curveCardinal.tension(0.3))
      .x((_, i) => xScale(i))
      .y((d) => yScale(-d));

    const hourMapper = ({ avg }) => [0, avg, 0];
    const dayMapper = (day) => day.flatMap(hourMapper);
    const displayData = punchCard.map(dayMapper);
    const paths = displayData.map(line);
    const flipPaths = displayData.map(flipLine);

    let svgPaths = paths.map((path, i) => ({ path, key: i }));
    let svgFlipPaths = flipPaths.map((path, i) => ({ path, key: i }));

    setSvgData({ paths: svgPaths, flipPaths: svgFlipPaths });
  }, [punchCard, height, width]);

  if (!punchCard.length) {
    return null;
  }

  return (
    <div className={chartStyles.container}>
      <svg className={chartStyles.chart} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className={svgStyles.axis}
            ref={xAxisRef}
            transform={`translate(0,${height})`}
          />
          <g className={svgStyles.axis} ref={yAxisRef} />
          <g transform={`translate(0,${-(dayHeight * 6)})`}>
            {svgData.paths.map(({ path, key }, i) => (
              <path
                key={key}
                transform={`translate(0,${dayHeight * i})`}
                className={classnames(svgStyles.path)}
                d={path}
              />
            ))}
          </g>
          <g transform={`translate(0,${-(dayHeight * 6)})`}>
            {svgData.flipPaths.map(({ path, key }, i) => (
              <path
                key={key}
                transform={`translate(0,${dayHeight * i})`}
                className={classnames(svgStyles.path)}
                d={path}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
