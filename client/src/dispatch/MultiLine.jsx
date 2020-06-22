import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import * as d3 from "d3";
import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";
import { intervalExtent, timeFormatterHourAM, isPhone, every6Hours } from "../clientUtils";

export const MultiLine = ({
  intervals = [],
  title,
  showHeader = false,
  useCumulative,
}) => {
  const [svgData, setSvgData] = useState([]);
  const [nowDot, setNowDot] = useState(null);

  const svgWidth = isPhone() ? 350 : 500;
  const svgHeight = 0.3 * svgWidth,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!intervals.length) {
      return;
    }

    const accessor = ({ length, cumulative }) =>
      useCumulative ? cumulative : length;

    const currentInterval = intervals[0];
    const xExtent = intervalExtent(currentInterval);
    const yExtent = [
      0,
      d3.max([1.0, ...intervals.flatMap(({ bins }) => bins).map(accessor)]),
    ];

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues(every6Hours(currentInterval.start))
      .tickFormat(timeFormatterHourAM)
      .tickSize(3);
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

    let newSvgData = paths.map((path, i) => ({ path, key: i })).reverse(); // render highlight after all others

    setSvgData(newSvgData);

    const bins = intervals[0].bins;
    if (bins.length) {
      const lastBin = bins[bins.length - 1];
      setNowDot({
        cx: xScale(lastBin.x0),
        cy: yScale(accessor(lastBin)),
        r: 3,
      });
    }
  }, [height, intervals, useCumulative, width]);

  if (!intervals.length) {
    return null;
  }

  const total = intervals[0].total;
  const lastIndex = svgData.length - 1;

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
            {svgData.map(({path, key}, i) => (
              <path
                key={key}
                className={classnames(svgStyles.path, {
                  [svgStyles.current]: i === lastIndex,
                })}
                d={path}
              />
            ))}
          </g>
          {nowDot && (
            <g className={svgStyles.now}>
              <circle {...nowDot} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
